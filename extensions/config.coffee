###
Blog middleware config. This can be fully customized,
but it's kept separate from the gulpfile since this
is also reusable on other projects, as-is.
###

# load middleware from the dependencies
loadExtensions = require("./middleware/lib/load")
middleware = loadExtensions("assemble-middleware-*")
helpers = loadExtensions("handlebars-helper-*")

# setup the configuration options to pass to assemble
module.exports =
  assemblerc: ".assemblerc.yml"
  middleware: middleware.concat(["./extensions/middleware/*.js"])
  helpers: helpers.concat(["./extensions/helpers/*.js"])
  collections: "<%= collections %>"

  collections: [
    name: "archive"
    plural: "archives"
    related_pages:
      template: "templates/list.hbs"
      pagination:
        prop: "num"
        limit: 2
        sortby: "date"

      dest: "<%= blog.dest %>/archives"

      permalinks:
        structure: ":archive/:numindex.html"
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
        ]
