const port = process.env.SERVER_PORT;

module.exports = {
  info: {
    title: "Tailor API",
    description: "These are the API docs for Tailor server.",
    contact: {
      url: "https://github.com/ExtensionEngine/tailor"
    },
    version: "1.0.0"
  },
  schemes: [
    "http"
  ],
  host: `localhost:${port}`,
  basePath: "/api/v1"
}
