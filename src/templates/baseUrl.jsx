function baseUrl(){
    const env = 'prod';
    let baseUrl = 'http://127.0.0.1:8000';
    if (env === 'prod'){
        baseUrl = 'https://technetapi.1000heads.net';
    }
    return baseUrl;
}

export default baseUrl;