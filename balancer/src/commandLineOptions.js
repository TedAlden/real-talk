/**
 * Load balancer command line options:
 * 
 * Arguments:
 *  -p, --port <number>  Port to run the load balancer on (default: 5001)
 *  -s, --servers <string>  List of servers to load balance (default: [])
 * 
 * Example:
 *  To load balance two local servers on ports 5101 and 5102, with the proxy/
 *  balancer server running on port 5001:
 *  
 *  node server.js -p 5001 -s http://localhost:5101 http://localhost:5102
 */

const commandLineOptions = [
  { name: "servers", alias: "s", type: String, multiple: true },
  { name: "port", alias: "p", type: Number },
];

export default commandLineOptions;
