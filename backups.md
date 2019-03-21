function httpRequest(api){
        return new Promise((resolve, reject) => {
            request(api, function(error, response, body){
                if(!error && response.statusCode === 200){
                    resolve(body)
                }else{
                    reject(error)
                }
            })
        })
    }

    httpRequest('http://192.168.1.122:3030/getUserInfo')
    .then((res) =>{
        console.log(res)
        ctx.render('index', {
            haha: '😆😆!'
        })
    })
    .catch(err =>{
        console.log(err)
    })