# Turbo + Redis Integration — Full-Stack Real-Time Guide

How Turbo Frames, Turbo Streams, Redis, ActionCable, and background jobs work together.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Rails Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐        ┌──────────────────┐            │
│  │  Turbo Frames    │        │  Turbo Streams   │            │
│  │  (Form/Link      │        │  (Real-Time      │            │
│  │   Interception)  │        │   Updates)       │            │
│  └────────┬─────────┘        └────────┬─────────┘            │
│           │                           │                       │
│           └───────────┬───────────────┘                       │
│                       ↓                                        │
│            ┌──────────────────────┐                           │
│            │   ActionCable        │                           │
│            │   (WebSocket)        │                           │
│            └──────────┬───────────┘                           │
│                       ↓                                        │
│  ┌─────────────────────────────────┐    ┌──────────────┐    │
│  │  Background Jobs (Sidekiq)      │    │ PostgreSQL   │    │
│  │  (Async broadcasts)             │────│ (Data store) │    │
│  └─────────────────────────────────┘    └──────────────┘    │
│                       ↓                                        │
│            ┌──────────────────────┐                           │
│            │      Redis           │                           │
│            │  (Cache, Sessions,   │                           │
│            │   PubSub, Queues)    │                           │
│            └──────────────────────┘                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↑
                    Browser (WebSocket)
```

---

## 🔄 Data Flow: User Creates a Post

### Step 1: Form Submission (Turbo Frame)

```
User fills form → Form submits → Turbo Frame intercepts
                                 → Request sent to controller (no full reload)
```

**Browser:**
```html
<!-- app/views/posts/_form.html.erb -->
<%= turbo_frame_tag "post_form" do %>
  <%= form_with(model: @post) do |f| %>
    <%= f.text_field :title %>
    <%= f.text_area :body %>
    <%= f.submit %>
  <% end %>
<% end %>
```

### Step 2: Controller Creates Post + Responds with Frame

```ruby
# app/controllers/posts_controller.rb

def create
  @post = Post.new(post_params)

  if @post.save
    # Respond with updated frame
    render :create  # create.turbo_stream.erb or create.html.erb
  else
    render :new, status: :unprocessable_entity
  end
end
```

### Step 3: Model Triggers Background Job (After Save)

```ruby
# app/models/post.rb

class Post < ApplicationRecord
  after_create_commit :notify_followers_async

  private

  def notify_followers_async
    NotifyFollowersJob.perform_later(id)
  end
end
```

### Step 4: Background Job Broadcasts to All Users

```ruby
# app/jobs/notify_followers_job.rb

class NotifyFollowersJob < ApplicationJob
  def perform(post_id)
    @post = Post.find(post_id)

    # Broadcast to all users' notification channels
    @post.user.followers.each do |follower|
      ActionCable.server.broadcast(
        "notifications:#{follower.id}",
        {
          action: 'append',
          target: 'notifications',
          html: render_notification(@post, follower)
        }
      )
    end

    # Broadcast to global feed
    ActionCable.server.broadcast(
      'feed',
      {
        action: 'prepend',
        target: 'posts',
        html: render_post(@post)
      }
    )
  end

  private

  def render_notification(post, user)
    ApplicationController.render(
      partial: 'notifications/item',
      locals: { post: post, user: user }
    )
  end

  def render_post(post)
    ApplicationController.render(
      partial: 'posts/post',
      locals: { post: post }
    )
  end
end
```

### Step 5: Redis Pubsub Delivers to Connected Clients

```
Redis receives broadcast message
              ↓
Matches subscriber (ActionCable connection)
              ↓
Sends Turbo Stream action to browser
              ↓
Browser receives (JSON with action, target, html)
              ↓
Turbo.StreamElement processes
              ↓
DOM updated (append/prepend/replace)
```

**Client-side (automatic with Turbo):**

```javascript
// Browser receives JSON via WebSocket:
{
  action: "prepend",
  target: "posts",
  html: "<div id='post_123'>...</div>"
}

// Turbo automatically:
// 1. Finds element with id="posts"
// 2. Prepends the HTML
// 3. Triggers Turbo event (turbo:load)
```

---

## 📊 Real-World Example: Chat Application

### Models

```ruby
# app/models/conversation.rb
class Conversation < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :participants, dependent: :destroy

  broadcasts_to ->(conversation) { "conversations:#{id}" },
    inserts_by: :prepend, target: "messages"
end

# app/models/message.rb
class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  after_create_commit :broadcast_to_conversation

  private

  def broadcast_to_conversation
    broadcast_prepend_to "conversations:#{conversation.id}",
      target: "messages",
      partial: "message",
      locals: { message: self }
  end
end
```

### Channels

```ruby
# app/channels/conversation_channel.rb
class ConversationChannel < ApplicationCable::Channel
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

# app/channels/notifications_channel.rb
class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end
end
```

### Views

```erb
<!-- app/views/conversations/show.html.erb -->

<div class="chat-container">
  <h1><%= @conversation.name %></h1>

  <!-- Messages list (Turbo Stream target) -->
  <%= turbo_frame_tag "messages" do %>
    <div id="messages" class="message-list">
      <%= render @conversation.messages %>
    </div>
  <% end %>

  <!-- Message form (Turbo Frame) -->
  <%= turbo_frame_tag "message_form" do %>
    <%= form_with(model: [@conversation, @message]) do |f| %>
      <%= f.text_area :content, placeholder: "Type message..." %>
      <%= f.submit "Send" %>
    <% end %>
  <% end %>

  <!-- Subscribe to real-time updates -->
  <% content_for :after_header do %>
    <%= turbo_stream_from @conversation %>
    <%= turbo_stream_from current_user %>
  <% end %>
</div>
```

### Controller

```ruby
# app/controllers/messages_controller.rb
class MessagesController < ApplicationController
  def create
    @conversation = Conversation.find(params[:conversation_id])
    @message = @conversation.messages.build(message_params)
    @message.user = current_user

    if @message.save
      # Turbo Frame auto-responds with create.turbo_stream.erb
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to @conversation }
      end

      # Notify other users (async)
      NotifyNewMessageJob.perform_later(@message.id)
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:message).permit(:content)
  end
end
```

### Background Job (Optional Notification)

```ruby
# app/jobs/notify_new_message_job.rb
class NotifyNewMessageJob < ApplicationJob
  def perform(message_id)
    @message = Message.find(message_id)
    @conversation = @message.conversation

    @conversation.participants.each do |participant|
      next if participant.user == @message.user

      ActionCable.server.broadcast(
        "notifications:#{participant.user.id}",
        {
          action: 'append',
          target: 'notifications',
          html: ApplicationController.render(
            partial: 'notifications/message_notification',
            locals: { message: @message }
          )
        }
      )
    end
  end
end
```

---

## 🚀 Workflow Summary

### Turbo Frame + Turbo Stream Combined

| Step | Component | Action |
|------|-----------|--------|
| 1 | **Browser** | User submits form inside Turbo Frame |
| 2 | **Turbo Frame** | Intercepts form, sends AJAX request |
| 3 | **Controller** | Creates record, renders turbo_stream response |
| 4 | **Frame Response** | Browser updates frame content (form cleared/errors shown) |
| 5 | **Model Callback** | `after_create_commit` triggers background job |
| 6 | **Background Job** | Sidekiq executes async |
| 7 | **ActionCable Broadcast** | Job sends message to Redis pubsub |
| 8 | **Redis Pubsub** | Routes broadcast to connected clients |
| 9 | **Turbo Stream (Client)** | Browser receives streaming action (JSON) |
| 10 | **DOM Update** | Turbo automatically updates page (append/prepend/replace) |

---

## 🔐 Session & Cache Flow

### How Redis Stores Session Data

```
User logs in
    ↓
Session created in Rails
    ↓
Redis stores: sessions:user_abc123 → {user_id: 1, ...}
    ↓
Browser gets session cookie
    ↓
Subsequent requests: cookie sent → Redis lookup → user data retrieved
```

### How Redis Caches ActionCable Subscriptions

```
User connects to /cable (WebSocket)
    ↓
Connection established via Redis
    ↓
Redis stores: action_cable:user_1:connection_xyz → {channel: PostsChannel, ...}
    ↓
Broadcast sent to "posts:5"
    ↓
Redis finds subscriptions to "posts:5"
    ↓
Delivers to all connected clients
```

---

## 🧪 Integration Test Example

```ruby
# spec/system/chat_spec.rb
describe "Chat", type: :system do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:conversation) { create(:conversation, users: [user1, user2]) }

  it "sends message and broadcasts to other user" do
    # User 1 opens chat
    visit_as user1, conversation_path(conversation)
    expect(page).to have_selector "#messages"

    # User 2 opens chat in another window
    using_session(:user2) do
      visit_as user2, conversation_path(conversation)
    end

    # User 1 sends message
    fill_in "Content", with: "Hello!"
    click_button "Send"

    # Message appears for user 1 (via Turbo Frame response)
    expect(page).to have_text "Hello!"

    # Message appears for user 2 (via Turbo Stream broadcast)
    using_session(:user2) do
      expect(page).to have_text "Hello!"
    end
  end
end
```

---

## ⚠️ Performance Considerations

### Optimize Broadcasts

**Problem:** Broadcast rendering HTML for every user individually

```ruby
# ❌ Inefficient
User.all.each do |user|
  html = render_to_string(:partial, ...)
  broadcast_to_user(user, html)  # Re-renders for each user
end
```

**Solution:** Render once, broadcast to all

```ruby
# ✅ Efficient
html = ApplicationController.render(partial: 'post', locals: { post: @post })
ActionCable.server.broadcast("posts", { html: html, action: 'append' })
```

### Cache Rendered Partials

```ruby
# app/models/post.rb
def broadcast_created
  cache_key = "post:#{id}:turbo_html"
  html = Rails.cache.fetch(cache_key, expires_in: 1.day) do
    ApplicationController.render(partial: 'posts/post', locals: { post: self })
  end

  ActionCable.server.broadcast('posts', { html: html, action: 'prepend' })
end
```

### Limit Broadcast Recipients

```ruby
# Only broadcast to users in the same workspace
def broadcast_created
  ActionCable.server.broadcast(
    "workspace:#{workspace_id}:posts",
    { html: render_post, action: 'prepend' }
  )
end
```

---

## 🔍 Debugging

### Check Redis Pubsub Activity

```bash
docker compose exec redis redis-cli

# Watch all pubsub messages
PSUBSCRIBE *

# Or specific channel
SUBSCRIBE "posts"
```

### Check ActionCable Connections

```ruby
# In Rails console
ActionCable.server.remote_connections.count
ActionCable.server.remote_connections.identifiers
```

### Verify Broadcast Is Happening

```ruby
# In model/controller
ActionCable.server.broadcast('posts', { test: true })

# Should see in redis MONITOR:
# PUBLISH "action_cable:posts" "{\"test\":true}"
```

---

## 📚 Reference Links

- **Full Architecture Guide**: See REDIS_CONFIGURATION.md, TURBO_STREAMS_GUIDE.md, TURBO_FRAMES_GUIDE.md
- **Rails Guides**: https://guides.rubyonrails.org/
- **Hotwire Docs**: https://hotwired.dev/
- **ActionCable**: https://guides.rubyonrails.org/action_cable_overview.html

