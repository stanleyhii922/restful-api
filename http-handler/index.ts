import * as https from 'https';

export const getMethod = (path:string) => {
    return new Promise((resolve, reject) => {
        const req = https.request(
            path, 
            {
                method:'GET',
            }, 
            (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data = data + chunk.toString();
                });
                
                response.on('end', () => {
                    try{
                        const body = JSON.parse(data);
                        resolve(body)
                    }catch(e){
                        reject(e);
                    }
                });
            });
        req.end();
    });
}