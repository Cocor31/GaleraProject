
/*********************************************/
/*** Middleware to log date for each request */
module.exports = (Route) => {
    return (req, res, next) => {
        if (process.env.LOG_ROUTE_REQUEST.toUpperCase() === "YES") {
            const event = new Date()
            console.log(`${Route} Time`, event.toString())
        }
        next()
    };
}
