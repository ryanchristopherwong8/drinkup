# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path
# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

Rails.application.config.assets.precompile += %w( conversations.js )
Rails.application.config.assets.precompile += %w( utcTimeConverter.js )
Rails.application.config.assets.precompile += %w( listRenderer.js )
Rails.application.config.assets.precompile += %w( eventRenderer.js )
Rails.application.config.assets.precompile += %w( createPageInitialize.js )
Rails.application.config.assets.precompile += %w( eventDatetimepickerConfig.js )
Rails.application.config.assets.precompile += %w( profileDatepickerConfig.js )
Rails.application.config.assets.precompile += %w( profileSettings.js )
Rails.application.config.assets.precompile += %w( chat.js )
Rails.application.config.assets.precompile += %w( showRenderer.js )
Rails.application.config.assets.precompile += %w( eventShared.js )