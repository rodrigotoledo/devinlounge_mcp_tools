# Turbo Streams — Complete Guide

Real-time server-sent updates with Rails ActionCable and Turbo Streams.

---

## 🎯 Turbo Streams Concepts

**Turbo Streams** allow the server to send HTML updates to the client over WebSocket (ActionCable) without requiring JavaScript API calls.

| Concept | Purpose | Use Case |
|---------|---------|----------|
| **Streams** | Named channels for real-time broadcast | `posts:1`, `notifications:user-5` |
| **Actions** | Operations on DOM (append, prepend, replace, remove) | Add comment, delete post, update count |
| **Broadcasting** | Server sends action to all connected clients | Notify users of new messages |
| **Polling** | Client-initiated periodic updates (fallback) | Non-critical data, lower latency needs |

---

## 📦 Gemfile Setup

```ruby
gem 'rails', '~> 8.1'
gem 'turbo-rails'          # Turbo + ActionCable
gem 'stimulus-rails'       # JavaScript framework
gem 'redis', '~> 5.0'      # ActionCable adapter
gem 'sidekiq', '~> 7.0'    # Background jobs
```

---

## 🏗️ Application Structure

### Generate ActionCable Channel

```bash
docker compose exec fullstack bin/rails generate channel Post updates
```

Output:
- `app/channels/post_channel.rb` — Channel definition
- `app/javascript/channels/post_channel.js` — Client subscription

---

## 🔌 Basic ActionCable Channel

### `app/channels/post_channel.rb`

```ruby
class PostChannel < ApplicationCable::Channel
  def subscribed
    # User subscribes to all post updates
    stream_from 'posts'
  end

  def receive(data)
    # Optional: handle incoming messages from client
    ActionCable.server.broadcast('posts', { message: data })
  end
end
```

### `app/channels/user_notifications_channel.rb`

```ruby
class UserNotificationsChannel < ApplicationCable::Channel
  def subscribed
    # Subscribe to user's own notifications only
    stream_for current_user
  end
end
```

### Client Subscription: `app/javascript/channels/post_channel.js`

```javascript
import consumer from "./consumer"

consumer.subscriptions.create("PostChannel", {
  connected() {
    console.log("Connected to PostChannel")
  },

  disconnected() {
    console.log("Disconnected from PostChannel")
  },

  received(data) {
    console.log("Received:", data)
  }
})
```

---

## 📡 Broadcasting from Models

### Model with Turbo Broadcasts

```ruby
# app/models/post.rb

class Post < ApplicationRecord
  after_create_commit :broadcast_post_created
  after_update_commit :broadcast_post_updated
  after_destroy_commit :broadcast_post_destroyed

  broadcasts_to ->(post) { "posts" }, target: "posts"

  private

  def broadcast_post_created
    # Option 1: Use broadcasts_to helper (automatic)
    # Already handled by broadcasts_to above

    # Option 2: Manual broadcast (more control)
    ActionCable.server.broadcast('posts', {
      action: 'append',
      target: 'posts',
      html: ApplicationController.render(partial: 'posts/post', locals: { post: self })
    })
  end

  def broadcast_post_updated
    ActionCable.server.broadcast("posts:#{id}", {
      action: 'replace',
      target: dom_id(self),
      html: ApplicationController.render(partial: 'posts/post', locals: { post: self })
    })
  end

  def broadcast_post_destroyed
    ActionCable.server.broadcast('posts', {
      action: 'remove',
      target: dom_id(self)
    })
  end
end
```

---

## 🎬 Turbo Stream Actions

### Available Actions

| Action | HTML Effect | Usage |
|--------|------------|-------|
| `append` | Add to end | New comment in thread |
| `prepend` | Add to beginning | New post at top |
| `replace` | Replace element | Update post title |
| `remove` | Delete element | Delete comment |
| `update` | Update HTML | Change counter |
| `before` | Insert before | Add separator |
| `after` | Insert after | Add timestamp |

### Rendering Turbo Streams from Controller

```ruby
# app/controllers/posts_controller.rb

class PostsController < ApplicationController
  def create
    @post = Post.new(post_params)

    if @post.save
      # Respond with Turbo Stream
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

### `app/views/posts/create.turbo_stream.erb`

```erb
<%= turbo_stream.append "posts", partial: "post", locals: { post: @post } %>
<%= turbo_stream.update "post-form", partial: "form", locals: { post: Post.new } %>
```

Or use the shorthand:

```erb
<%= turbo_stream.append "posts" do %>
  <%= render "post", post: @post %>
<% end %>
```

### Manual Turbo Stream Response

```ruby
# app/controllers/posts_controller.rb

def update
  @post = Post.find(params[:id])

  if @post.update(post_params)
    render turbo_stream: turbo_stream.replace(@post, partial: "post", locals: { post: @post })
  else
    render :edit, status: :unprocessable_entity
  end
end
```

---

## 🌊 Broadcasting from Background Jobs

### Broadcast in Job

```ruby
# app/jobs/notify_users_job.rb

class NotifyUsersJob < ApplicationJob
  queue_as :default

  def perform(post_id)
    @post = Post.find(post_id)
    @users = User.where.not(id: @post.user_id)

    @users.each do |user|
      ActionCable.server.broadcast(
        "user_notifications:#{user.id}",
        {
          action: 'append',
          target: 'notifications',
          html: ApplicationController.render(
            partial: 'notifications/item',
            locals: { notification: { message: "New post: #{@post.title}" } }
          )
        }
      )
    end
  end
end
```

### Trigger Job on Model Create

```ruby
# app/models/post.rb

class Post < ApplicationRecord
  after_create_commit :notify_users_later

  private

  def notify_users_later
    NotifyUsersJob.perform_later(id)
  end
end
```

---

## 📝 View Integration

### Partial with `data-turbo-stream-source`

```erb
<!-- app/views/posts/_post.html.erb -->

<div id="<%= dom_id(post) %>" class="post">
  <h2><%= post.title %></h2>
  <p><%= post.body %></p>
  <time><%= post.created_at.strftime('%b %d') %></time>
</div>
```

### Container for Appending

```erb
<!-- app/views/posts/index.html.erb -->

<div id="posts">
  <%= render @posts %>
</div>
```

### Form with Turbo Stream Fallback

```erb
<!-- app/views/posts/_form.html.erb -->

<%= form_with(model: post, local: true) do |form| %>
  <% if post.errors.any? %>
    <div id="error_explanation">
      <%= pluralize(post.errors.count, "error") %> prohibited saving:
      <ul>
        <% post.errors.full_messages.each do |message| %>
          <li><%= message %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div class="field">
    <%= form.label :title %>
    <%= form.text_field :title %>
  </div>

  <div class="field">
    <%= form.label :body %>
    <%= form.text_area :body %>
  </div>

  <div class="actions">
    <%= form.submit "Create Post" %>
  </div>
<% end %>
```

---

## 🔐 Authorization

### Secure Channel Subscription

```ruby
# app/channels/chat_channel.rb

class ChatChannel < ApplicationCable::Channel
  def subscribed
    @conversation = Conversation.find(params[:conversation_id])

    if authorized?
      stream_for @conversation
    else
      reject
    end
  end

  private

  def authorized?
    current_user.conversations.include?(@conversation)
  end
end
```

### Current User in Channel

```ruby
# app/channels/application_cable/connection.rb

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      if verified_user = User.find_by(id: cookies.encrypted[:user_id])
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
```

---

## 💬 Example: Real-Time Comment System

### Model

```ruby
# app/models/comment.rb

class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user

  after_create_commit :broadcast_comment_created

  private

  def broadcast_comment_created
    broadcast_prepend_to "post:#{post.id}:comments",
      target: "comments",
      partial: "comments/comment",
      locals: { comment: self, post: post }
  end
end
```

### Channel

```ruby
# app/channels/post_comments_channel.rb

class PostCommentsChannel < ApplicationCable::Channel
  def subscribed
    @post = Post.find(params[:post_id])
    stream_for @post
  end
end
```

### View

```erb
<!-- app/views/posts/show.html.erb -->

<div class="post">
  <h1><%= @post.title %></h1>
  <p><%= @post.body %></p>
</div>

<div class="comments">
  <h2>Comments</h2>
  
  <div id="comments">
    <%= render @post.comments %>
  </div>

  <div id="comment-form">
    <%= render "comments/form", post: @post, comment: Comment.new %>
  </div>
</div>

<% content_for :after_header do %>
  <%= turbo_stream_from @post %>
<% end %>
```

### Partial

```erb
<!-- app/views/comments/_comment.html.erb -->

<div id="<%= dom_id(comment) %>" class="comment">
  <strong><%= comment.user.name %></strong>
  <p><%= comment.body %></p>
  <time><%= comment.created_at.strftime('%b %d, %l:%M %p') %></time>
</div>
```

---

## 🔄 Polling Fallback

For browsers without WebSocket support:

```erb
<!-- app/views/posts/index.html.erb -->

<div id="posts" data-turbo-poll="2000">
  <%= render @posts %>
</div>
```

This polls `/posts` every 2 seconds and merges changes. (Not recommended for high-frequency updates.)

---

## 🧪 Testing Turbo Streams

### RSpec Request Spec

```ruby
# spec/requests/posts_spec.rb

describe "Posts", type: :request do
  describe "POST /posts" do
    it "broadcasts post creation" do
      expect {
        post "/posts", params: { post: { title: "New Post", body: "Content" } }
      }.to have_broadcast_to("posts")
    end
  end
end
```

Requires `gem 'rspec-rails'` and ActionCable matchers (covered in TESTING_TURBO.md).

---

## ⚠️ Common Issues

### Turbo Stream Not Broadcasting

**Check:**
1. Redis is running: `docker compose exec redis redis-cli ping`
2. ActionCable adapter is Redis: `Rails.application.config.action_cable`
3. Broadcast happening after commit: Use `after_*_commit` callbacks
4. Channel subscription matches broadcast stream name

### Browser Not Receiving Updates

**Check:**
1. WebSocket connected: Open DevTools → Network → Filter by "WS"
2. Channel subscribed: Browser console should log "Connected to..."
3. No CORS errors blocking WebSocket
4. Cable URL correct in `config/cable.yml`

---

## 📚 Reference

- **Turbo Documentation**: https://turbo.hotwired.dev/handbook/streams
- **ActionCable Guide**: https://guides.rubyonrails.org/action_cable_overview.html
- **Broadcasting**: https://guides.rubyonrails.org/action_cable_overview.html#broadcasting

