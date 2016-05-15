source 'https://rubygems.org'
#installs the version of ruby used in development
ruby "2.2.3"

gem 'mail', '2.6.3'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.5'
# Use postgresql as the database for Active Record
gem 'pg'
#unicorn gem
gem 'unicorn'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# use moment.js for formatting date and time in javascript
gem 'momentjs-rails', '~> 2.11'
gem 'moment_timezone-rails'

# use rails variables in your JS
gem 'gon'

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
#gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc


gem 'bootstrap-sass', '~> 3.2.0'

#profile pictures
gem 'paperclip'
gem 'aws-sdk', '< 2.0'
gem 'figaro'

gem 'geokit-rails'

#chat box
#rackup private_pub.ru -s thin -E production; start thin server
gem 'private_pub'
gem 'thin'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Enables logs to be directed to stdout instead of to disk. REQUIRED for Heroku deployment.
# Read more: https://github.com/heroku/rails_12factor
gem 'rails_12factor', group: :production

#When the Rack::Timeout limit is hit, it closes the requests and generates a stacktrace 
#in the logs that can be used for future debugging of long running code
gem 'rack-timeout'

source 'https://rails-assets.org' do
  gem 'rails-assets-datetimepicker'
end

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  #gem 'byebug'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  #gem 'spring'
end

gem 'bcrypt'