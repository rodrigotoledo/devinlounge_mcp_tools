# Phoenix / Elixir Setup Guide

Comprehensive configuration for Phoenix 1.7+ web framework with ExUnit testing, Credo linting, and Elixir best practices.

---

## 📦 Essential Mix Dependencies

### `mix.exs` Template

```elixir
defmodule YourApp.MixProject do
  use Mix.Project

  def project do
    [
      app: :your_app,
      version: "0.1.0",
      elixir: "~> 1.16",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  def application do
    [
      mod: {YourApp.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      # Phoenix core
      {:phoenix, "~> 1.7.0"},
      {:phoenix_html, "~> 4.0"},
      {:phoenix_live_reload, "~> 1.4", only: :dev},
      {:phoenix_live_view, "~> 0.20.0"},
      {:phoenix_live_dashboard, "~> 0.8.0"},

      # Database
      {:ecto_sql, "~> 3.10"},
      {:postgrex, ">= 0.0.0"},
      {:ecto_enum, "~> 1.4"},

      # Authentication
      {:guardian, "~> 2.3"},
      {:bcrypt_elixir, "~> 3.0"},
      {:joken, "~> 2.6"},

      # HTTP & API
      {:httpoison, "~> 2.0"},
      {:jason, "~> 1.4"},
      {:corsica, "~> 2.1"},

      # Pagination & search
      {:scrivener_ecto, "~> 2.7"},
      {:ex_machina, "~> 2.7", only: :test},

      # Caching & sessions
      {:redix, "~> 1.2"},
      {:telemetry, "~> 1.2"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},

      # Error handling
      {:sentry, "~> 10.0"},
      {:error_handler, "~> 0.1.0"},

      # Development & testing
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:dialyzer, "~> 1.4", only: [:dev], runtime: false},
      {:mix_test_watch, "~> 1.1", only: :dev, runtime: false},
      {:ex_doc, "~> 0.31", only: :dev, runtime: false},

      # Testing
      {:ex_unit_notifier, "~> 1.0", only: :test},
      {:mox, "~> 1.1", only: :test},
      {:stream_data, "~> 0.6", only: :test},

      # Utilities
      {:gettext, "~> 0.24"},
      {:decimal, "~> 2.0"},
      {:timex, "~> 3.7"},
      {:slugify, "~> 1.3"},

      # Runtime
      {:plug_cowboy, "~> 2.6"},
      {:esbuild, "~> 0.8", runtime: Mix.env() == :dev},
      {:tailwind, "~> 0.2", runtime: Mix.env() == :dev},

      # Deployment
      {:kamal, "~> 1.0", runtime: false},
      {:fly_postgres, "~> 0.6"}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      reset: ["ecto.drop", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "test.watch": ["watch", "mix test"],
      lint: ["credo", "dialyzer"],
      format: ["format", "credo --fix"]
    ]
  end
end
```

---

## 🎯 Credo Configuration

### `.credo.exs`

```elixir
%{
  configs: [
    %{
      name: "default",
      files: %{
        included: ["lib/", "test/"],
        excluded: ["test/support/"]
      },
      checks: [
        # Code style
        {Credo.Check.Design.AliasUsage, safe: true, if_nested_deeper_than: 2},
        {Credo.Check.Design.DuplicatedCode, excluded_macros: []},
        {Credo.Check.Design.TagTODO, exit_status: 0},
        {Credo.Check.Design.TagFIXME, exit_status: 0},

        # Readability
        {Credo.Check.Readability.AliasOrder},
        {Credo.Check.Readability.FunctionNames},
        {Credo.Check.Readability.LargeNumbers},
        {Credo.Check.Readability.MaxLineLength, priority: :low, max_length: 100},
        {Credo.Check.Readability.ModuleAttributeNames},
        {Credo.Check.Readability.ModuleDoc, exclude: [Mix.Tasks]},
        {Credo.Check.Readability.ModuleNames},
        {Credo.Check.Readability.ParenthesesAroundConditions},
        {Credo.Check.Readability.ParenthesesOnZeroArityDefs},
        {Credo.Check.Readability.PipeIntoAnonymousFunctions},
        {Credo.Check.Readability.SingleFunctionToBlockNotation},
        {Credo.Check.Readability.StringSigils},
        {Credo.Check.Readability.TrailingBlankLine},
        {Credo.Check.Readability.TrailingWhiteSpace},
        {Credo.Check.Readability.UnnecessaryAliasExpansion},
        {Credo.Check.Readability.VariableNames},

        # Refactoring
        {Credo.Check.Refactor.CyclomaticComplexity, max_complexity: 12},
        {Credo.Check.Refactor.FunctionArity, max_arity: 5},
        {Credo.Check.Refactor.LongQuoteBlocks},
        {Credo.Check.Refactor.MapInto, false},
        {Credo.Check.Refactor.MatchInCondition},
        {Credo.Check.Refactor.NegatedConditionsInUnless},
        {Credo.Check.Refactor.NegatedConditionsWithElse},
        {Credo.Check.Refactor.Nesting, max_nesting: 2},
        {Credo.Check.Refactor.PipeChainStart, excluded_argument_types: [:atom, :literal]},
        {Credo.Check.Refactor.UnlessWithElse},

        # Warnings
        {Credo.Check.Warning.BoolOperationOnSameValues},
        {Credo.Check.Warning.ExpressionsAsConditions},
        {Credo.Check.Warning.IExPry},
        {Credo.Check.Warning.IoInspect},
        {Credo.Check.Warning.LazyLoggingConditionallyDisabled},
        {Credo.Check.Warning.OperationOnSameValues},
        {Credo.Check.Warning.OperationWithConstantResult},
        {Credo.Check.Warning.RaiseInsideRescue},
        {Credo.Check.Warning.UnusedEnumOperation},
        {Credo.Check.Warning.UnusedFileOperation},
        {Credo.Check.Warning.UnusedKeywordOperation},
        {Credo.Check.Warning.UnusedListOperation},
        {Credo.Check.Warning.UnusedPathOperation},
        {Credo.Check.Warning.UnusedRegexOperation},
        {Credo.Check.Warning.UnusedStringOperation},
        {Credo.Check.Warning.UnusedTupleOperation},

        # Consistency
        {Credo.Check.Consistency.ExceptionNames},
        {Credo.Check.Consistency.LineEndings},
        {Credo.Check.Consistency.ParameterPatternMatching},
        {Credo.Check.Consistency.SpaceAroundOperators},
        {Credo.Check.Consistency.SpaceInParentheses},
        {Credo.Check.Consistency.TabsOrSpaces}
      ]
    }
  ]
}
```

---

## 🧪 ExUnit Configuration

### `test/test_helper.exs`

```elixir
ExUnit.start()

# Setup Ecto for testing
Ecto.Adapters.SQL.Sandbox.mode(YourApp.Repo, :manual)

# Import conveniences for testing with channels and connection
import Phoenix.ConnTest
import Phoenix.ChannelTest

# Helper functions
defmodule YourApp.TestHelper do
  use ExUnit.Case
  import Ecto.Query

  @doc "Creates a user and returns it"
  def create_user(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "test@example.com",
        password_hash: Argon2.hash_pwd_salt("password"),
        confirmed_at: DateTime.utc_now()
      })
      |> YourApp.Accounts.create_user()

    user
  end

  @doc "Creates a database transaction for test isolation"
  def setup_db_transaction(_context) do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(YourApp.Repo)

    on_exit(fn ->
      Ecto.Adapters.SQL.Sandbox.checkin(YourApp.Repo)
    end)

    :ok
  end
end
```

---

## 📋 ExUnit Structure

### Model Test Example

```elixir
defmodule YourApp.Accounts.UserTest do
  use ExUnit.Case
  doctest YourApp.Accounts.User

  alias YourApp.Accounts.User

  describe "User.changeset/2" do
    test "validates required fields" do
      changeset = User.changeset(%User{}, %{})

      refute changeset.valid?
      assert Enum.any?(changeset.errors, &match?({:email, _}, &1))
      assert Enum.any?(changeset.errors, &match?({:password, _}, &1))
    end

    test "validates email format" do
      changeset = User.changeset(%User{}, %{
        email: "invalid-email",
        password: "password123"
      })

      refute changeset.valid?
      assert {"has invalid format", _} = changeset.errors[:email]
    end

    test "validates password minimum length" do
      changeset = User.changeset(%User{}, %{
        email: "test@example.com",
        password: "short"
      })

      refute changeset.valid?
      assert {"should be at least %{count} character(s)", _} = changeset.errors[:password]
    end

    test "hashes password before save" do
      changeset = User.changeset(%User{}, %{
        email: "test@example.com",
        password: "securepassword123"
      })

      assert changeset.valid?
      refute is_nil(changeset.changes[:password_hash])
      assert changeset.changes[:password_hash] != "securepassword123"
    end
  end

  describe "User.verify_password/2" do
    test "verifies password when correct" do
      user = %User{password_hash: Argon2.hash_pwd_salt("password")}
      assert User.verify_password(user, "password")
    end

    test "rejects incorrect password" do
      user = %User{password_hash: Argon2.hash_pwd_salt("password")}
      refute User.verify_password(user, "wrong_password")
    end
  end
end
```

### Controller Test Example

```elixir
defmodule YourAppWeb.UserControllerTest do
  use YourAppWeb.ConnCase

  alias YourApp.Accounts

  describe "list users" do
    test "lists all users", %{conn: conn} do
      user = create_user()

      conn = get(conn, "/api/users")

      assert json_response(conn, 200) == [
        %{
          "id" => user.id,
          "email" => user.email
        }
      ]
    end
  end

  describe "get user" do
    test "returns user by id", %{conn: conn} do
      user = create_user()

      conn = get(conn, "/api/users/#{user.id}")

      assert json_response(conn, 200)["email"] == user.email
    end

    test "returns 404 when user not found", %{conn: conn} do
      conn = get(conn, "/api/users/999")

      assert json_response(conn, 404)["error"] == "Not found"
    end
  end

  describe "create user" do
    test "creates user with valid params", %{conn: conn} do
      conn = post(conn, "/api/users", %{
        email: "new@example.com",
        password: "securepassword123"
      })

      assert json_response(conn, 201)["email"] == "new@example.com"
    end

    test "returns 422 with invalid params", %{conn: conn} do
      conn = post(conn, "/api/users", %{
        email: "invalid"
      })

      assert json_response(conn, 422)["errors"]
    end
  end

  # Helper functions
  defp create_user(attrs \\ %{}) do
    defaults = %{
      email: "test#{System.unique_integer()}@example.com",
      password: "securepassword123"
    }

    {:ok, user} = Accounts.create_user(Map.merge(defaults, attrs))
    user
  end
end
```

---

## 🔧 Development Workflow

### Running Tests

```bash
# All tests
docker compose exec phoenix mix test

# Specific test file
docker compose exec phoenix mix test test/accounts/user_test.exs

# Specific test
docker compose exec phoenix mix test test/accounts/user_test.exs:12

# Watch mode (re-run on file changes)
docker compose exec phoenix mix test.watch

# With coverage
docker compose exec phoenix mix coveralls
```

### Linting & Formatting

```bash
# Check code style
docker compose exec phoenix mix credo

# Fix common issues
docker compose exec phoenix mix credo --fix

# Format code
docker compose exec phoenix mix format

# Type checking (optional)
docker compose exec phoenix mix dialyzer
```

### Creating Generators

```bash
# Generate context (business logic grouping)
docker compose exec phoenix mix phx.gen.context Accounts User users email:string password_hash:string

# Generate schema only
docker compose exec phoenix mix phx.gen.schema User users email:string

# Generate controller with actions
docker compose exec phoenix mix phx.gen.html Accounts User users email:string
```

### Database Migrations

```bash
# Create migration
docker compose exec phoenix mix ecto.gen.migration create_users_table

# Run migrations
docker compose exec phoenix mix ecto.migrate

# Rollback migration
docker compose exec phoenix mix ecto.rollback

# Reset database
docker compose exec phoenix mix ecto.reset
```

---

## 📝 Phoenix Project Structure

```
lib/
├── your_app.ex                      # Main application module
├── your_app_web.ex                  # Web module
├── your_app/
│   ├── application.ex               # Supervision tree
│   ├── repo.ex                      # Database repo
│   ├── mailer.ex                    # Email sending
│   └── contexts/                    # Business logic (grouped by feature)
│       ├── accounts/
│       │   ├── user.ex              # Ecto schema
│       │   ├── accounts.ex          # Context module (queries, mutations)
│       │   └── authentication.ex    # Auth logic
│       ├── products/
│       │   ├── product.ex
│       │   └── products.ex
│       └── orders/
│           ├── order.ex
│           └── orders.ex
└── your_app_web/
    ├── router.ex                    # Route definitions
    ├── telemetry.ex                 # Monitoring
    ├── endpoint.ex                  # Phoenix endpoint
    ├── controllers/                 # HTTP request handlers
    │   ├── user_controller.ex
    │   └── product_controller.ex
    ├── live/                        # LiveView modules (real-time)
    │   ├── user_live.ex
    │   └── user_live/
    │       ├── show.ex
    │       └── form_component.ex
    ├── views/
    │   ├── user_html.ex
    │   └── user_html/
    │       ├── show.html.heex
    │       └── index.html.heex
    ├── components/
    │   ├── layouts.ex               # Layout components
    │   └── core_components.ex       # Reusable UI components
    └── channels/                    # WebSocket channels
        └── user_channel.ex

test/
├── test_helper.exs                  # Test configuration
├── support/
│   ├── conn_case.ex                 # Helper for controller tests
│   ├── data_case.ex                 # Helper for model tests
│   └── fixtures/
│       └── accounts_fixtures.ex     # Test data factories
├── accounts/
│   ├── user_test.exs
│   └── accounts_test.exs
└── your_app_web/
    ├── controllers/
    │   └── user_controller_test.exs
    └── live/
        └── user_live_test.exs

priv/
├── repo/
│   ├── migrations/                  # Database migrations
│   └── seeds.exs                    # Seed data
└── static/                          # Static assets
```

---

## ⚡ Common Patterns

### Context Module (Business Logic)

```elixir
defmodule YourApp.Accounts do
  @moduledoc "The Accounts context"

  import Ecto.Query, warn: false
  alias YourApp.Repo
  alias YourApp.Accounts.User

  @doc "Returns list of users"
  def list_users do
    Repo.all(User)
  end

  @doc "Gets a single user by id"
  def get_user(id) do
    Repo.get(User, id)
  end

  @doc "Gets a user by email"
  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  @doc "Creates a user"
  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc "Updates a user"
  def update_user(user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc "Deletes a user"
  def delete_user(user) do
    Repo.delete(user)
  end
end
```

### LiveView Module (Real-time UI)

```elixir
defmodule YourAppWeb.UserLive.Index do
  use YourAppWeb, :live_view

  alias YourApp.Accounts
  alias YourApp.Accounts.User

  @impl true
  def mount(_params, _session, socket) do
    {:ok, stream(socket, :users, Accounts.list_users())}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="space-y-4">
      <.header>
        Users
        <:actions>
          <.link patch={~p"/users/new"} class="btn btn-primary">
            New User
          </.link>
        </:actions>
      </.header>

      <.table id="users" rows={@streams.users}>
        <:col :let={{_id, user}} label="Email"><%= user.email %></:col>
        <:action :let={{_id, user}}>
          <div class="sr-only">
            <.link navigate={~p"/users/#{user}"}>Show</.link>
          </div>
        </:action>
      </.table>
    </div>
    """
  end
end
```

---

## 🔒 Security Best Practices

1. **Never log passwords** — Always use sanitized logging
2. **Hash passwords** — Use Bcrypt or Argon2
3. **Validate input** — Use Ecto changesets for validation
4. **Authenticate requests** — Use Guardian or similar
5. **CORS** — Configure appropriately for frontend origin
6. **SQL Injection** — Ecto prevents this automatically
7. **Secrets** — Use environment variables, never hardcode

---

## 📚 References

- **Phoenix Guides:** https://hexdocs.pm/phoenix/
- **Ecto Docs:** https://hexdocs.pm/ecto/
- **Elixir School:** https://elixirschool.com/
- **ExUnit Docs:** https://hexdocs.pm/ex_unit/
- **Credo Documentation:** https://hexdocs.pm/credo/

---

## 🧩 Integration with Docker & Project

### Docker Command Reference

```bash
# Install dependencies
docker compose exec phoenix mix deps.get

# Run migrations
docker compose exec phoenix mix ecto.migrate

# Create database
docker compose exec phoenix mix ecto.create

# Seed data
docker compose exec phoenix mix run priv/repo/seeds.exs

# Interactive shell
docker compose exec phoenix iex -S mix

# Start development server
docker compose exec phoenix iex -S mix phx.server

# Run tests
docker compose exec phoenix mix test

# Code quality
docker compose exec phoenix mix credo
docker compose exec phoenix mix format --check-formatted

# Production build
docker compose exec phoenix mix release
```

---

**Last Updated:** 2026-04-16  
**Phoenix Version:** 1.7+  
**Elixir Version:** 1.16+
