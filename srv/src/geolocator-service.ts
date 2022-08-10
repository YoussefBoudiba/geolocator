const axios = require('axios').default;
const xsenv = require('@sap/xsenv');

module.exports = (srv: any) => {
    srv.on('READ', 'Users', async (req: any) => {
        try {
            //@ts-ignore
            const sDestinationName = process.env.API_DESTINATION as string;
            let config = await getAxiosConfigBasic(sDestinationName);
            const destinationServiceResponse = await axios.get("/Users", {
                baseURL: config.destinationServiceBaseUrl,
                headers: { 'Authorization': `Basic ${config.authToken}` }
            });
            const users = destinationServiceResponse.data.results;
            return users;
        } catch (error) {
            return [];
        }
    });
};

// Helper functions
const getAxiosConfigBasic = async (destination: string) => {
    xsenv.loadEnv();
    const xsuaa_service = xsenv.serviceCredentials({ label: "xsuaa" });
    const destination_service = xsenv.serviceCredentials({ label: "destination" });
    // 1. Get Access Token
    const xsuaaResponse = await axios.get("/oauth/token?grant_type=client_credentials", {
        baseURL: xsuaa_service.url,
        auth: { username: destination_service.clientid, password: destination_service.clientsecret }
    });
    const accessToken = xsuaaResponse.data.access_token;
    // 2.  Get Auth Token
    const destinationResponse = await axios.get(`/destination-configuration/v1/destinations/${destination}`, {
        baseURL: destination_service.uri,
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const destinationServiceBaseUrl = destinationResponse.data.destinationConfiguration.URL;
    const authToken = destinationResponse.data.authTokens[0].value;
    return { destinationServiceBaseUrl: destinationServiceBaseUrl, authToken: authToken };
}