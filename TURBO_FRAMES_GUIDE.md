# Turbo Frames — Complete Guide

Partial page replacement without full navigation using Turbo Frames.

---

## 🎯 Turbo Frames Concepts

**Turbo Frames** intercept form submissions and link clicks to replace only a portion of the page, avoiding full page reloads.

| Concept | Purpose | Use Case |
|---------|---------|----------|
| **Frame** | Named section of page | `id="posts"`, `id="modal"` |
| **Lazy Loading** | Load frame content on demand | Tabs, accordions, modals |
| **Nested Frames** | Frames inside frames | Comment threads, nested lists |
| **Forms** | Auto-submit within frame | Inline editing, quick actions |

---

## 📦 Setup

```ruby
# Already included in Gemfile
gem 'turbo-rails'
gem 'stimulus-rails'
```

---

## 🎬 Basic Turbo Frame

### Simple Frame

```erb
<!-- app/views/posts/index.html.erb -->

<div class="container">
  <h1>Posts</h1>

  <!-- Turbo Frame: replaces this div's content -->
  <%= turbo_frame_tag "posts" do %>
    <%= render @posts %>
  <% end %>
</div>
```

When a link inside the frame navigates (or a form submits), only the frame content updates—no full page reload.

### Frame Attributes

```erb
<!-- Different frame options -->

<!-- Basic frame -->
<%= turbo_frame_tag "my_frame" do %>
  Content here
<% end %>

<!-- Lazy load: load via AJAX on demand -->
<%= turbo_frame_tag "lazy_content", src: posts_path(lazy: true), loading: "lazy" do %>
  <!-- Placeholder while loading -->
  <p>Loading...</p>
<% end %>

<!-- Disable auto-navigation (manual only) -->
<%= turbo_frame_tag "my_frame", data: { turbo_action: "advance" } do %>
  Content
<% end %>

<!-- Target another frame -->
<%= link_to "Edit", edit_post_path(post), data: { turbo_frame: "post_edit" } %>
```

---

## 🔄 Nested Frames

### Parent-Child Relationship

```erb
<!-- app/views/posts/show.html.erb -->

<div class="post">
  <h1><%= @post.title %></h1>

  <!-- Parent frame: entire post section -->
  <%= turbo_frame_tag @post do %>
    <p><%= @post.body %></p>

    <!-- Nested frame: just comments -->
    <%= turbo_frame_tag "post_comments" do %>
      <%= render @post.comments %>
    <% end %>
  <% end %>
</div>
```

Form submission inside nested frame only updates nested frame, not parent.

---

## 📝 Forms in Frames

### Form Auto-Submit in Frame

```erb
<!-- app/views/posts/_edit.html.erb -->

<%= turbo_frame_tag @post do %>
  <%= form_with(model: @post, local: true) do |form| %>
    <div class="field">
      <%= form.label :title %>
      <%= form.text_field :title %>
    </div>

    <div class="actions">
      <%= form.submit "Save" %>
    </div>
  <% end %>
<% end %>
```

When the form submits, the response replaces the frame content.

### Controller Response

```ruby
# app/controllers/posts_controller.rb

def update
  @post = Post.find(params[:id])

  if @post.update(post_params)
    # For Turbo Frame request: responds with updated frame
    # For HTML request: redirects
    respond_to do |format|
      format.turbo_stream { render :update }
      format.html { redirect_to @post, notice: 'Post updated.' }
    end
  else
    # Re-render form inside frame on error
    render :edit, status: :unprocessable_entity
  end
end

private

def post_params
  params.require(:post).permit(:title, :body)
end
```

### Edit View (Inline)

```erb
<!-- app/views/posts/_form.html.erb -->

<%= turbo_frame_tag @post, class: "edit-form" do %>
  <%= form_with(model: @post, local: true) do |form| %>
    <% if @post.errors.any? %>
      <div id="error_explanation">
        <h2><%= pluralize(@post.errors.count, "error") %> prohibited this post:</h2>
        <ul>
          <% @post.errors.full_messages.each do |message| %>
            <li><%= message %></li>
          <% end %>
        </ul>
      </div>
    <% end %>

    <div class="field">
      <%= form.label :title %>
      <%= form.text_field :title, class: "form-control" %>
    </div>

    <div class="field">
      <%= form.label :body %>
      <%= form.text_area :body, class: "form-control" %>
    </div>

    <div class="actions">
      <%= form.submit "Save", class: "btn btn-primary" %>
      <%= link_to "Cancel", @post, class: "btn btn-secondary" %>
    </div>
  <% end %>
<% end %>
```

---

## 🔗 Links in Frames

### Link Behavior

```erb
<!-- Links inside frame replace frame content -->

<%= turbo_frame_tag "sidebar" do %>
  <!-- Clicking replaces "sidebar" frame -->
  <%= link_to "Profile", profile_path(current_user) %>
  
  <!-- This navigates normally (full page) -->
  <%= link_to "Home", root_path, data: { turbo_frame: "_top" } %>
<% end %>
```

### Targeting Other Frames

```erb
<!-- Link replaces content of "modal" frame, not current frame -->

<%= turbo_frame_tag "list" do %>
  <%= link_to "View Details", post_path(post), data: { turbo_frame: "modal" } %>
<% end %>

<%= turbo_frame_tag "modal" do %>
  <!-- Modal content loads here -->
<% end %>
```

---

## 🎪 Lazy Loading Tabs

### HTML Structure

```erb
<!-- app/views/dashboard/index.html.erb -->

<div class="tabs">
  <nav>
    <%= link_to "Overview", dashboard_path(tab: "overview"), 
        data: { turbo_frame: "tab_content" }, class: "tab-link active" %>
    <%= link_to "Analytics", dashboard_path(tab: "analytics"), 
        data: { turbo_frame: "tab_content" }, class: "tab-link" %>
    <%= link_to "Settings", dashboard_path(tab: "settings"), 
        data: { turbo_frame: "tab_content" }, class: "tab-link" %>
  </nav>

  <!-- Tab content loads here -->
  <%= turbo_frame_tag "tab_content", src: dashboard_path(tab: "overview"), loading: "eager" do %>
    <p>Loading...</p>
  <% end %>
</div>
```

### Controller

```ruby
# app/controllers/dashboard_controller.rb

def index
  @tab = params[:tab] || "overview"
  
  respond_to do |format|
    format.html { render :index }
    format.turbo_stream { render "tabs/#{@tab}" }
  end
end
```

### Tab Views

```erb
<!-- app/views/dashboard/tabs/_overview.html.erb -->

<%= turbo_frame_tag "tab_content" do %>
  <h2>Overview</h2>
  <div class="stats">
    <p>Total Posts: <%= current_user.posts.count %></p>
    <p>Total Views: <%= current_user.total_views %></p>
  </div>
<% end %>
```

---

## 🚨 Modal Dialogs with Frames

### Modal with Lazy Loading

```erb
<!-- app/views/posts/index.html.erb -->

<div class="posts-list">
  <%= render @posts %>
</div>

<!-- Hidden modal frame, loads on demand -->
<%= turbo_frame_tag "modal" do %>
<% end %>

<style>
  #modal[src] {
    display: none;
  }

  #modal:has(> *) {
    display: flex;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
  }
</style>

<script>
  // Show modal when frame loads
  document.addEventListener('turbo:load', (e) => {
    const modal = document.querySelector('#modal');
    if (modal?.hasChildNodes()) {
      modal.style.display = 'flex';
    }
  });
</script>
```

### Modal Toggle Link

```erb
<!-- app/views/posts/_post.html.erb -->

<div class="post">
  <h3><%= link_to post.title, post_path(post) %></h3>
  <p><%= truncate(post.body, length: 100) %></p>
  
  <%= button_to "View Details", post_path(post), 
      method: :get, data: { turbo_frame: "modal" } %>
</div>
```

### Modal View

```erb
<!-- app/views/posts/show.html.erb (modal) -->

<%= turbo_frame_tag "modal", class: "modal-content" do %>
  <div class="modal-header">
    <h2><%= @post.title %></h2>
    <%= link_to "✕", root_path, data: { turbo_frame: "modal" }, class: "close" %>
  </div>

  <div class="modal-body">
    <%= @post.body %>
  </div>

  <div class="modal-footer">
    <%= link_to "Edit", edit_post_path(@post) %>
    <%= link_to "Delete", @post, method: :delete, data: { confirm: "Sure?" } %>
  </div>
<% end %>
```

---

## ✏️ Inline Editing

### Toggle Edit Mode

```erb
<!-- app/views/posts/_post.html.erb -->

<div id="<%= dom_id(post) %>">
  <%= turbo_frame_tag post, class: "editable-post" do %>
    <h2><%= post.title %></h2>
    <p><%= post.body %></p>
    
    <%= link_to "Edit", edit_post_path(post), 
        remote: true, class: "btn btn-sm" %>
  <% end %>
</div>
```

### Edit Controller & View

```ruby
# app/controllers/posts_controller.rb

def edit
  @post = Post.find(params[:id])
  # Turbo Frame auto-replaces post content with form
end

def update
  @post = Post.find(params[:id])
  
  if @post.update(post_params)
    # Form inside frame, re-render post (frame updates)
    render :show
  else
    # Show form again with errors
    render :edit, status: :unprocessable_entity
  end
end
```

---

## 🔀 Morphing (Turbo 8+)

Morphing updates DOM in-place for smoother transitions:

```erb
<%= link_to "Refresh", post_path(@post), 
    data: { turbo_action: "replace" } %>
```

---

## 🧪 Testing Turbo Frames

### RSpec System Spec

```ruby
# spec/system/posts_spec.rb

describe "Inline editing", type: :system do
  let(:post) { create(:post) }

  it "updates post inline" do
    visit posts_path

    click_link "Edit"
    expect(page).to have_selector "input[value='#{post.title}']"

    fill_in "Title", with: "Updated Title"
    click_button "Save"

    expect(page).to have_text "Updated Title"
    expect(page).not_to have_selector "input"
  end
end
```

### Request Spec

```ruby
# spec/requests/posts_spec.rb

describe "PATCH /posts/:id" do
  let(:post) { create(:post) }

  it "updates post and responds with frame" do
    patch post_path(post), 
      params: { post: { title: "New Title" } },
      headers: { "Turbo-Frame" => "post_#{post.id}" }

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("New Title")
  end
end
```

---

## ⚠️ Common Issues

### Frame Not Updating After Form Submit

**Check:**
1. Response includes frame tag matching request frame ID
2. Form is inside frame with matching ID
3. No redirect happening (redirect exits frame mode)
4. Controller responds to the format sent

### Nested Frame Replaces Parent Instead

**Fix:**
```ruby
# Ensure response has correct frame ID
render turbo_stream: turbo_stream.replace("child_frame", ...)
```

### Link Navigation Not Intercepted

**Check:**
1. Link is inside turbo_frame_tag
2. Link doesn't have `data-turbo="false"`
3. No `data-turbo_frame="_top"` set

---

## 📚 Reference

- **Turbo Frames Handbook**: https://turbo.hotwired.dev/handbook/frames
- **Turbo Rails Gem**: https://github.com/hotwired/turbo-rails
- **ActionView Frame Tag Docs**: https://api.rubyonrails.org/classes/ActionView/Helpers/TurboFramesHelper.html

