# Turbo Rails Patterns — Best Practices & Rules

Essential patterns and rules for using Turbo Frames and Turbo Streams in Rails applications.

---

## 🎯 Core Rule: Always Enable Turbo

**Every view should be compatible with Turbo Frames and Turbo Streams.** Design for progressive enhancement:

```erb
<!-- Bad: Turbo disabled by default -->
<%= link_to "View Post", post_path(post), data: { turbo: false } %>

<!-- Good: Works with Turbo by default -->
<%= link_to "View Post", post_path(post) %>

<!-- Good: Explicit Turbo Frame targeting -->
<%= link_to "View Post", post_path(post), data: { turbo_frame: "_top" } %>
```

---

## 👤 Rule 1: Current User Updates → Turbo ERB Files (View Layer)

**For single-user interactions**, render turbo responses directly in view templates.

### Use Case
- User updates their own profile
- User creates a post
- User deletes their own comment
- Form submissions affecting only current user

### Pattern

**Controller:**
```ruby
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def update
    @user = current_user

    if @user.update(user_params)
      respond_to do |format|
        format.turbo_stream  # Renders update.turbo_stream.erb
        format.html { redirect_to @user }
      end
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :bio)
  end
end
```

**View Template (Turbo ERB):**
```erb
<!-- app/views/users/update.turbo_stream.erb -->

<!-- Update user card -->
<%= turbo_stream.replace "user-profile" do %>
  <%= render "users/profile", user: @user %>
<% end %>

<!-- Clear the form -->
<%= turbo_stream.update "edit-form" do %>
  <p class="text-green-600">Profile updated!</p>
<% end %>

<!-- Append success notification -->
<%= turbo_stream.append "notifications" do %>
  <%= render "notifications/success", message: "Your profile has been updated." %>
<% end %>
```

### Why View Layer?
- Single user action: no need for background processing
- Immediate response (no async delay)
- View has access to local context
- Simple, synchronous operation
- No broadcast to other users needed

---

## 🔄 Rule 2: Session/Broadcast Updates → Model (Never Controller)

**For multi-user interactions that broadcast**, trigger broadcasts from model callbacks, not controller logic.

### Use Case
- Post created → notify followers
- Comment added → notify watchers
- User followed → notify followed user
- Status changed → notify all subscribers
- Event happens → broadcast to session participants

### Pattern

**Model (Source of Truth):**
```ruby
# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy

  # ✅ Broadcasts triggered in model
  after_create_commit :broadcast_post_created
  after_update_commit :broadcast_post_updated
  after_destroy_commit :broadcast_post_destroyed

  private

  def broadcast_post_created
    # Broadcast to all users viewing the feed
    ActionCable.server.broadcast(
      'feed:posts',
      {
        action: 'prepend',
        target: 'posts',
        html: ApplicationController.render(
          partial: 'posts/post',
          locals: { post: self }
        )
      }
    )

    # Async: Notify followers (heavy operation)
    NotifyFollowersJob.perform_later(id)
  end

  def broadcast_post_updated
    ActionCable.server.broadcast(
      "post:#{id}",
      {
        action: 'replace',
        target: dom_id(self),
        html: ApplicationController.render(
          partial: 'posts/post',
          locals: { post: self }
        )
      }
    )
  end

  def broadcast_post_destroyed
    ActionCable.server.broadcast(
      'feed:posts',
      {
        action: 'remove',
        target: dom_id(self)
      }
    )
  end
end
```

**Controller (No Broadcasting Logic):**
```ruby
# ❌ WRONG: Broadcasting in controller
class PostsController < ApplicationController
  def create
    @post = Post.new(post_params)

    if @post.save
      # ❌ Don't do this in controller
      ActionCable.server.broadcast('feed:posts', ...)
      
      respond_to do |format|
        format.turbo_stream
      end
    end
  end
end

# ✅ CORRECT: Just save, model handles broadcasting
class PostsController < ApplicationController
  def create
    @post = Post.new(post_params)

    if @post.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to @post }
      end
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :body)
  end
end
```

**View (Turbo ERB):**
```erb
<!-- app/views/posts/create.turbo_stream.erb -->
<!-- Just confirm to current user, model handles broadcasting to others -->

<%= turbo_stream.update "post-form" do %>
  <p class="text-green-600">Post created successfully!</p>
<% end %>
```

### Why Model Layer?
- **Consistency**: All post creation goes through same path (API, console, background job)
- **Decoupling**: Controller doesn't know about broadcasting
- **Reusability**: Works whether called from controller, job, API, or console
- **Single Responsibility**: Model owns its state changes and notifications

### Broadcast Locations Hierarchy
```
Model Callback (ALWAYS)
  ↓ after_create_commit
  ↓ after_update_commit
  ↓ after_destroy_commit
  └─→ For heavy operations: trigger background job

Background Job (For Heavy Operations)
  ↓ NotifyFollowersJob, SendEmailsJob, UpdateAnalyticsJob
  └─→ Does broadcast + other work asynchronously

Controller Response (Current User Only)
  └─→ Turbo ERB files, nothing else
```

---

## 🚀 Rule 3: Heavy Logic or Complex Operations → Background Jobs

**When broadcasting requires CPU-intensive work, move to jobs.**

### Use Case
- Rendering large lists for broadcast (1000+ items)
- Multiple database queries
- External API calls
- Image processing
- Complex calculations
- Notifying many users

### Pattern

**Model (Trigger Job):**
```ruby
# app/models/post.rb
class Post < ApplicationRecord
  after_create_commit :enqueue_post_notifications

  private

  def enqueue_post_notifications
    # Simple broadcast: synchronous in callback
    broadcast_post_created

    # Heavy work: async in job
    NotifyFollowersJob.perform_later(id)
  end

  def broadcast_post_created
    # Light operation: render minimal HTML
    ActionCable.server.broadcast(
      'feed:posts',
      {
        action: 'prepend',
        target: 'posts',
        html: ApplicationController.render(
          partial: 'posts/post',
          locals: { post: self }
        )
      }
    )
  end
end
```

**Background Job (Heavy Work):**
```ruby
# app/jobs/notify_followers_job.rb
class NotifyFollowersJob < ApplicationJob
  queue_as :default

  def perform(post_id)
    @post = Post.find(post_id)
    @followers = @post.user.followers.limit(5000)  # ⚠️ Big list

    # Process in batches to avoid memory issues
    @followers.find_in_batches(batch_size: 500) do |batch|
      broadcast_to_batch(batch)
    end
  end

  private

  def broadcast_to_batch(followers)
    followers.each do |follower|
      # Broadcast notification to each user
      ActionCable.server.broadcast(
        "user_notifications:#{follower.id}",
        {
          action: 'append',
          target: 'notifications',
          html: render_notification
        }
      )
    end
  end

  def render_notification
    ApplicationController.render(
      partial: 'notifications/post_notification',
      locals: { post: @post }
    )
  end
end
```

### When to Use Jobs
- ✅ Notifying 100+ users
- ✅ External API calls
- ✅ Complex calculations
- ✅ Email sending
- ✅ Image processing
- ❌ Quick updates (form validation feedback)
- ❌ Single-user updates
- ❌ < 100ms operations

---

## 📦 Rule 4: Large Datasets → find_in_batches

**When iterating over many records, always use batching.**

### Use Case
- Broadcasting to many users
- Bulk updates
- Importing large files
- Processing subscribers
- Notifying followers

### Pattern

**Without Batching (❌ BAD - Memory Issue):**
```ruby
# This loads ALL records into memory at once
followers = user.followers  # 100,000 records in memory

followers.each do |follower|  # Iterates 100,000 times
  broadcast_to_user(follower)
end
```

**With Batching (✅ GOOD - Memory Efficient):**
```ruby
# app/jobs/notify_followers_job.rb
class NotifyFollowersJob < ApplicationJob
  def perform(post_id)
    @post = Post.find(post_id)

    # Load 500 at a time (configurable batch size)
    @post.user.followers.find_in_batches(batch_size: 500) do |batch|
      broadcast_to_batch(batch)
    end
  end

  private

  def broadcast_to_batch(followers)
    followers.each do |follower|
      ActionCable.server.broadcast(
        "notifications:#{follower.id}",
        { html: render_notification(follower) }
      )
    end
  end
end
```

### Batch Size Guidelines
| Scenario | Batch Size | Reason |
|----------|-----------|--------|
| Simple broadcast | 1000 | Minimal data, fast |
| With rendering | 500 | View rendering costs |
| Complex DB queries | 100 | Multiple JOINs |
| External APIs | 25 | API rate limits |
| Heavy processing | 10 | CPU-intensive work |

### find_in_batches vs each_batch
```ruby
# find_in_batches (Recommended)
Post.find_in_batches(batch_size: 500) do |batch|
  batch.each { |post| process(post) }
end

# each_batch (Alias, same thing)
Post.each_batch(batch_size: 500) do |batch|
  batch.each { |post| process(post) }
end
```

---

## 📋 Complete Example: Post Creation Flow

Combining all rules:

### Model (Broadcasts + Job Trigger)
```ruby
# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user

  after_create_commit :broadcast_and_notify

  private

  def broadcast_and_notify
    # Light: Direct broadcast to current session
    broadcast_created

    # Heavy: Async job for notifications
    NotifyFollowersJob.perform_later(id)
  end

  def broadcast_created
    ActionCable.server.broadcast(
      'feed:posts',
      {
        action: 'prepend',
        target: 'posts',
        html: ApplicationController.render(partial: 'posts/post', locals: { post: self })
      }
    )
  end
end
```

### Controller (Just Save)
```ruby
# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def create
    @post = Post.new(post_params)

    if @post.save
      respond_to do |format|
        format.turbo_stream  # Render create.turbo_stream.erb
        format.html { redirect_to @post }
      end
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :body)
  end
end
```

### View (Current User Feedback)
```erb
<!-- app/views/posts/create.turbo_stream.erb -->

<!-- Clear form for current user -->
<%= turbo_stream.update "post-form" do %>
  <p class="text-green-600">Post created!</p>
  <%= render "form", post: Post.new %>
<% end %>
```

### Background Job (Heavy Work + Broadcasting)
```ruby
# app/jobs/notify_followers_job.rb
class NotifyFollowersJob < ApplicationJob
  def perform(post_id)
    @post = Post.find(post_id)

    # Process followers in batches (memory efficient)
    @post.user.followers.find_in_batches(batch_size: 500) do |batch|
      broadcast_to_batch(batch)
    end
  end

  private

  def broadcast_to_batch(followers)
    followers.each do |follower|
      ActionCable.server.broadcast(
        "notifications:#{follower.id}",
        {
          action: 'append',
          target: 'notifications',
          html: ApplicationController.render(
            partial: 'notifications/post_notification',
            locals: { post: @post, user: follower }
          )
        }
      )
    end
  end
end
```

### View Subscription
```erb
<!-- app/views/dashboard/index.html.erb -->

<div id="posts">
  <%= render @posts %>
</div>

<!-- Subscribe to live feed -->
<% content_for :after_header do %>
  <%= turbo_stream_from 'feed:posts' %>
  <%= turbo_stream_from "notifications:#{current_user.id}" %>
<% end %>
```

---

## 🚦 Decision Tree

```
User action triggers state change
    ↓
    ├─ Single user, quick? → Model callback broadcasts → View responds (Turbo ERB)
    │
    ├─ Multiple users, simple? → Model callback broadcasts → View responds
    │
    └─ Multiple users, heavy?
        ├─ Render big list? → Job with find_in_batches + broadcast
        ├─ External API? → Job with API calls + broadcast
        ├─ Many queries? → Job with preload + broadcast
        └─ Image process? → Job async + broadcast when done
```

---

## ✅ Checklist

- [ ] All Turbo responses in `.turbo_stream.erb` files (not hardcoded in controller)
- [ ] Current-user-only updates: View layer (turbo_stream.erb)
- [ ] Multi-user broadcasts: Model callbacks (after_*_commit)
- [ ] Heavy/complex work: Background jobs
- [ ] Processing 100+ records: find_in_batches
- [ ] Batch size chosen based on operation complexity
- [ ] Controller only saves/validates (no broadcasting logic)
- [ ] Model owns all state change broadcasts
- [ ] Jobs handle heavy lifting (notifications, emails, APIs)
- [ ] Views subscribe to correct streams

---

## 🚨 Common Mistakes

### ❌ Broadcasting in Controller
```ruby
def create
  @post = Post.new(post_params)
  if @post.save
    ActionCable.server.broadcast(...)  # ❌ Wrong location
  end
end
```

**Fix:** Move to `app/models/post.rb` `after_create_commit` callback.

### ❌ Iterating All Records at Once
```ruby
followers = user.followers  # Loads all 100k into memory
followers.each { |f| broadcast(f) }  # ❌ Memory bomb
```

**Fix:** Use `find_in_batches(batch_size: 500)`.

### ❌ Synchronous Heavy Work in Callback
```ruby
after_create_commit do
  # ❌ API calls block the response
  user.followers.each { |f| send_email(f) }
end
```

**Fix:** Enqueue job: `NotifyFollowersJob.perform_later(id)`.

### ❌ Hardcoding Turbo Response in Controller
```ruby
def create
  @post = Post.new(post_params)
  if @post.save
    render turbo_stream: turbo_stream.append(...)  # ❌ View logic in controller
  end
end
```

**Fix:** Create `create.turbo_stream.erb` template.

---

## 📚 Related Documentation

- [TURBO_STREAMS_GUIDE.md](TURBO_STREAMS_GUIDE.md) — Technical details
- [TURBO_FRAMES_GUIDE.md](TURBO_FRAMES_GUIDE.md) — Frame patterns
- [TURBO_REDIS_INTEGRATION.md](TURBO_REDIS_INTEGRATION.md) — Architecture
- [REDIS_CONFIGURATION.md](REDIS_CONFIGURATION.md) — Infrastructure
- [TESTING_TURBO_ACTIONCABLE.md](TESTING_TURBO_ACTIONCABLE.md) — Test patterns

