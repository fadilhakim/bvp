require 'compass/import-once/activate';

Encoding.default_external = "utf-8"

http_path = "https://london.bridestory.com"

http_images_dir = "raw/upload/business-home/assets/"
#require "compass/utilities/sprites";
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
css_dir = "stylesheets"
sass_dir = "sass"
images_dir = "assets"
javascripts_dir = "javascripts"

# You can select your preferred output style here (can be overridden via the command line):
output_style = :compact 

# relative_assets = true # For working on local
relative_assets = false # For working on staging & production

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

asset_cache_buster :none