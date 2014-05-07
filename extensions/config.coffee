###
Blog middleware config. This can be fully customized,
but it's kept separate from the gulpfile since this
is also reusable on other projects, as-is.
###

# resolveDep = require "resolve-dep"

# # load middleware from the dependencies
# middleware = resolveDep("assemble-middleware-*")
# helpers = resolveDep("handlebars-helper-*")

# setup the configuration options to pass to assemble
  # assemblerc: ".assemblerc.yml"
  # middleware: middleware.concat(["./extensions/middleware/*.js"])
  # helpers: helpers.concat(["./extensions/helpers/*.js"])
module.exports = [
  {
    name: "post"
    plural: "posts"
  }
  {
    name: "archive"
    plural: "archives"
    related_pages:
      template: "templates/archives.hbs"
      pagination:
        prop: "num"
        limit: 2
        sortby: "date"

      dest: "<%= blog.dest %>/archives"
      permalinks:
        structure: ":archive/page-:numindex.html"
        replacements: [
          {
            pattern: ":archive"
            replacement: ->
              @archive.replace /-/g, "/"
          }
          {
            pattern: ":num"
            replacement: ->
              return ""  if @num is 1
              @num + "/"
          }
        ]
  }
]