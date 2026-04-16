# Testing Turbo Streams & ActionCable — Complete Guide

Unit, integration, and system testing for real-time features.

---

## 📦 Test Dependencies

Add to `Gemfile`:

```ruby
group :test do
  gem 'rspec-rails', '~> 7.0'
  gem 'rspec-json_expectations'
  gem 'rails-controller-testing'
  gem 'action-cable-testing'  # For ActionCable tests
  gem 'webmock', '~> 3.24'
  gem 'vcr', '~> 6.3'
  gem 'selenium-webdriver'    # For browser automation
  gem 'capybara', '~> 3.40'   # Browser testing
  gem 'database_cleaner-active_record', '~> 2.2'
end
```

Install: `docker compose exec fullstack bundle install`

---

## 🧪 Unit Tests (Model Broadcast)

### Test Model Broadcast Callback

```ruby
# spec/models/post_spec.rb
require 'rails_helper'

describe Post, type: :model do
  describe 'broadcasts' do
    let(:post) { create(:post) }

    it 'broadcasts post creation' do
      expect {
        Post.create!(title: 'Test', body: 'Content')
      }.to have_broadcasted_to('posts').with(
        action: 'append',
        target: 'posts'
      )
    end

    it 'broadcasts post update' do
      expect {
        post.update!(title: 'Updated')
      }.to have_broadcasted_to("post:#{post.id}").with(
        action: 'replace'
      )
    end

    it 'broadcasts post deletion' do
      expect {
        post.destroy
      }.to have_broadcasted_to('posts').with(
        action: 'remove'
      )
    end
  end
end
```

### Setup: Enable Broadcasting in Tests

```ruby
# spec/spec_helper.rb

RSpec.configure do |config|
  # Enable ActionCable broadcasting for tests
  config.before(:each) do
    ActionCable.server.pubsub.instance_variable_set(:@subscriptions, {})
  end
end
```

Or in `spec/rails_helper.rb`:

```ruby
require 'action-cable/testing'

RSpec.configure do |config|
  config.include ActionCable::TestHelper
end
```

---

## 🔌 ActionCable Channel Tests

### Channel Subscription Tests

```ruby
# spec/channels/post_channel_spec.rb
require 'rails_helper'

describe PostChannel, type: :channel do
  describe 'subscription' do
    it 'successfully subscribes' do
      subscribe
      expect(subscription).to be_confirmed
    end

    it 'streams from posts' do
      subscribe
      expect(streams).to include 'posts'
    end
  end
end
```

### Channel with Parameters

```ruby
# spec/channels/user_notifications_channel_spec.rb
require 'rails_helper'

describe UserNotificationsChannel, type: :channel do
  let(:user) { create(:user) }

  before { stub_connection current_user: user }

  describe 'subscription' do
    it 'subscribes to user notifications' do
      subscribe user_id: user.id
      expect(subscription).to be_confirmed
    end

    it 'streams for current user' do
      subscribe user_id: user.id
      expect(streams).to include "user_notifications:#{user.id}"
    end
  end

  describe 'receive' do
    it 'handles incoming message' do
      subscribe user_id: user.id

      # Simulate client message
      expect {
        perform :receive, { message: 'Hello' }
      }.to broadcast_to('notifications')
    end
  end
end
```

### Channel Authorization Test

```ruby
# spec/channels/private_channel_spec.rb
describe PrivateChannel, type: :channel do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context 'when authorized' do
    before { stub_connection current_user: user }

    it 'allows subscription' do
      subscribe user_id: user.id
      expect(subscription).to be_confirmed
    end
  end

  context 'when not authorized' do
    before { stub_connection current_user: other_user }

    it 'rejects subscription' do
      subscribe user_id: user.id
      expect(subscription).to be_rejected
    end
  end
end
```

---

## 📡 Request Tests (Turbo Stream Response)

### Test Turbo Stream Response

```ruby
# spec/requests/posts_spec.rb
require 'rails_helper'

describe 'Posts API', type: :request do
  describe 'POST /posts' do
    it 'responds with turbo_stream' do
      post '/posts', params: {
        post: { title: 'New', body: 'Content' }
      }, headers: { 'Accept' => 'text/vnd.turbo-stream.html' }

      expect(response).to have_http_status(:ok)
      expect(response.content_type).to include 'text/vnd.turbo-stream.html'
      expect(response.body).to include 'turbo-stream'
      expect(response.body).to include 'append'
    end

    it 'includes new post HTML' do
      post '/posts', params: {
        post: { title: 'Test', body: 'Content' }
      }, headers: { 'Accept' => 'text/vnd.turbo-stream.html' }

      expect(response.body).to include 'Test'
      expect(response.body).to include 'Content'
    end
  end

  describe 'PATCH /posts/:id' do
    let(:post) { create(:post) }

    it 'responds with turbo_stream update' do
      patch "/posts/#{post.id}", params: {
        post: { title: 'Updated' }
      }, headers: { 'Accept' => 'text/vnd.turbo-stream.html' }

      expect(response).to have_http_status(:ok)
      expect(response.body).to include 'turbo-stream'
      expect(response.body).to include 'replace'
      expect(response.body).to include 'Updated'
    end
  end

  describe 'DELETE /posts/:id' do
    let(:post) { create(:post) }

    it 'responds with turbo_stream remove' do
      delete "/posts/#{post.id}", 
        headers: { 'Accept' => 'text/vnd.turbo-stream.html' }

      expect(response).to have_http_status(:ok)
      expect(response.body).to include 'turbo-stream'
      expect(response.body).to include 'remove'
    end
  end
end
```

### Test Turbo Frame Request

```ruby
# spec/requests/posts_spec.rb
describe 'Turbo Frames', type: :request do
  let(:post) { create(:post) }

  it 'responds to turbo_frame request' do
    get post_path(post), headers: { 'Turbo-Frame' => dom_id(post) }

    expect(response).to have_http_status(:ok)
    expect(response.body).to include "turbo-frame"
    expect(response.body).to include dom_id(post)
  end

  it 'returns partial content for lazy-loaded frame' do
    get posts_path(lazy: true), 
      headers: { 'Accept' => 'text/vnd.turbo-stream.html' }

    expect(response).to have_http_status(:ok)
  end
end
```

---

## 🌐 System Tests (Full Browser)

### Setup Capybara for System Tests

```ruby
# spec/support/capybara.rb
Capybara.default_driver = :selenium_chrome_headless

Capybara.register_driver :selenium_chrome_headless do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('--headless')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')

  Selenium::WebDriver::Chrome::Driver.new(app, options: options)
end
```

### Turbo Frame System Test

```ruby
# spec/system/posts_spec.rb
require 'rails_helper'

describe 'Inline Editing', type: :system do
  let(:post) { create(:post, title: 'Original', body: 'Content') }

  scenario 'user edits post inline' do
    visit post_path(post)
    expect(page).to have_text 'Original'

    # Click edit (loads form in turbo frame)
    click_link 'Edit'

    # Wait for form to appear (JavaScript/Turbo processed)
    expect(page).to have_selector "form input[value='Original']"

    # Update title
    fill_in 'Title', with: 'Updated'
    click_button 'Save'

    # Form replaced with post view
    expect(page).to have_text 'Updated'
    expect(page).not_to have_selector 'form input'
  end
end
```

### Turbo Stream System Test

```ruby
# spec/system/live_notifications_spec.rb
require 'rails_helper'

describe 'Live Notifications', type: :system do
  let(:user) { create(:user) }

  scenario 'notification appears in real-time' do
    # User 1 opens page
    visit_as user, root_path
    expect(page).to have_selector '#notifications'

    # User 2 (in another session) performs action that broadcasts
    using_session(:user2) do
      other_user = create(:user)
      visit_as other_user, root_path

      # Perform action that broadcasts to user
      click_link "Follow User"
    end

    # Notification appears for User 1 (Turbo Stream broadcast)
    expect(page).to have_text 'Someone followed you'
  end
end
```

### Multi-User Chat Test

```ruby
# spec/system/chat_spec.rb
describe 'Chat', type: :system do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:conversation) { create(:conversation, users: [user1, user2]) }

  scenario 'message broadcasts to all participants' do
    # User 1 opens chat
    visit_as user1, conversation_path(conversation)
    expect(page).to have_selector '#messages'

    # User 2 opens chat (separate browser session)
    using_session(:user2) do
      visit_as user2, conversation_path(conversation)
    end

    # User 1 sends message
    fill_in 'Content', with: 'Hello from User 1'
    click_button 'Send'

    # Message appears for User 1 (Turbo Frame response)
    expect(page).to have_text 'Hello from User 1'

    # Message appears for User 2 (Turbo Stream broadcast)
    using_session(:user2) do
      expect(page).to have_text 'Hello from User 1'
    end
  end
end
```

---

## 🔄 Background Job + Broadcast Tests

### Test Job Broadcasting

```ruby
# spec/jobs/notify_followers_job_spec.rb
require 'rails_helper'

describe NotifyFollowersJob, type: :job do
  let(:user) { create(:user) }
  let(:follower) { create(:user) }

  before do
    user.followers << follower
  end

  it 'broadcasts notification to followers' do
    post = create(:post, user: user)

    expect {
      NotifyFollowersJob.perform_now(post.id)
    }.to have_broadcasted_to("notifications:#{follower.id}")
  end

  it 'includes post information in broadcast' do
    post = create(:post, user: user, title: 'New Post')

    expect {
      NotifyFollowersJob.perform_now(post.id)
    }.to have_broadcasted_to("notifications:#{follower.id}").with(
      hash_including(html: include('New Post'))
    )
  end
end
```

### Test Model Callback Triggers Job

```ruby
# spec/models/post_spec.rb
describe Post do
  it 'enqueues NotifyFollowersJob on create' do
    expect {
      create(:post)
    }.to have_enqueued_job(NotifyFollowersJob)
  end
end
```

---

## 🧬 ActionCable Connection Tests

### Test WebSocket Connection

```ruby
# spec/channels/application_cable/connection_spec.rb
require 'rails_helper'

module ApplicationCable
  describe Connection, type: :channel do
    it 'successfully connects with valid user' do
      user = create(:user)
      connect(current_user: user)

      expect(connection.current_user).to eq user
    end

    it 'rejects connection without user' do
      expect { connect }.to raise_error(
        ActionCable::Connection::UnauthorizedError
      )
    end
  end
end
```

---

## 📊 Test Helpers

### Custom RSpec Matcher for Turbo Streams

```ruby
# spec/support/turbo_matchers.rb

RSpec::Matchers.define :have_turbo_stream_action do |action|
  match do |response|
    response.body.include?(%(<turbo-stream action="#{action}"))
  end

  failure_message do |response|
    "Expected response to have turbo-stream with action '#{action}'"
  end
end

# Usage:
expect(response).to have_turbo_stream_action('append')
```

### Helper to Visit as User

```ruby
# spec/support/auth_helpers.rb

module AuthHelpers
  def visit_as(user, path)
    login_as user
    visit path
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :system
end
```

---

## 🔍 Debugging Tests

### Print Response Body

```ruby
it 'broadcasts correctly' do
  post '/posts', params: { ... }
  puts response.body  # See actual HTML
end
```

### Check Broadcast Calls

```ruby
it 'broadcasts to correct channel' do
  expect {
    create(:post)
  }.to have_broadcasted_to('posts').at_least(:once)
end
```

### Debug Channel Subscription

```ruby
it 'streams correct data' do
  subscribe
  puts streams  # [Array of stream names]
end
```

---

## 🚨 Common Test Failures

### "Subscription not confirmed"

```ruby
# ❌ Problem
subscribe
expect(subscription).to be_confirmed

# ✅ Solution
subscribe
# Make sure channel's subscribed method doesn't reject
expect(subscription).to be_confirmed
```

### "Expected broadcast, none occurred"

```ruby
# ❌ Problem
expect { action }.to have_broadcasted_to('channel')

# ✅ Solution - Ensure callback runs
config.after(:each) do
  # Wait for async callbacks
  ActiveJob::Base.queue_adapter.perform_all_enqueued_jobs(at_time: Time.current)
end
```

### "Timeout waiting for element"

```ruby
# ❌ Problem - Element not appearing after broadcast
expect(page).to have_text 'New Content'

# ✅ Solution - Wait for broadcast
expect(page).to have_text('New Content', wait: 5)
```

---

## 📋 Test Checklist

- [ ] Unit tests for model broadcast callbacks
- [ ] Channel subscription tests (authorized/unauthorized)
- [ ] Request tests for turbo_stream responses
- [ ] Request tests for turbo_frame handling
- [ ] System tests for Turbo Frame updates
- [ ] System tests for Turbo Stream broadcasts
- [ ] Job tests for broadcasting
- [ ] Connection tests for current_user
- [ ] Error handling (validation failures)
- [ ] Concurrent user scenarios (multi-session)

---

## 📚 Reference

- **Action Cable Testing**: https://guides.rubyonrails.org/testing.html#testing-action-cable
- **Capybara**: https://github.com/teamcapybara/capybara
- **RSpec Rails**: https://relishapp.com/rspec/rspec-rails/
- **Selenium WebDriver**: https://www.selenium.dev/documentation/webdriver/

