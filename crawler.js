var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');
var url = 'http://www.mmjpg.com/mm/924';

//获取html-body结构	
function download(url,callback){
	request(url,function(err,res,body){
		if (!err && res.statusCode == 200) {
			//console.log(body) // 打印首页
			callback(body);
		}
	})

}

//获取html中img最大数及其地址
//
var imgArr = [];

download(url, function(data) {
    var $ = cheerio.load(data);
    var nMax = $('#opic').prev().text();
    console.log(nMax);
    for (var i = 1; i < nMax; i++) {
        var url2 = 'http://www.mmjpg.com/mm/924/' + i;
        download(url2, function(data) {
            var $ = cheerio.load(data);
            $('#content').find('img').each(function(i, e) {
                console.log((i + 1) + ":" + $(e).attr('src'));
                imgArr.push($(e).attr('src'))
            })
            downloadImg(imgArr);
        })
    }
})

function downloadImg(resource) {
    resource.forEach(function(src, idx) {
        var num = 1;
        var filename = src.substring(src.lastIndexOf('/') + 1);
        var writestream = fs.createWriteStream("img/" + filename);
        request(src).pipe(writestream);
        
        writestream.on('finish', function() {
            console.log('page: ' + num + '-' + filename);
        });
    })
}