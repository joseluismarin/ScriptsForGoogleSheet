// Source: https://codeseo.io/an-old-friend/

//Usage:

// getStatus(url, followredirect)      | =getStatus(H2, true)
// getDescription(url, followredirect) | =getDescription(H2, true)
// getTitle(url, followredirect)       | =getTitle(H2, true)
// getCache(url)                       | =getCache(H2)
// getIP(ip)                           | =getIP(H2)


// Checks the http status of a url
function getStatus(url, followredirect)
{

  if (!url) return "";

  followredirect = followredirect? true : false; 

  var response,code; 

  try{

    response = UrlFetchApp.fetch(url, {muteHttpExceptions: true, followRedirects: followredirect });
    code     = response.getResponseCode();

  }catch(e){

    return "Error: " + e;

  }

  if (code == 200) 
    return "Page Works: Response (" + code + ")"; 
  else
    return "URL Issue: Response (" + code + ")";

}


function getIP(ip){

  ip = ip ? ip : false;

  var response,code; 

  try{

    if (ip){

      var url = "https://ipinfo.io/" + ip + "/json";
      Logger.log(url)

    }else{

      var url = "https://ipinfo.io/json";

    }
    response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    page     = response.getContentText();
    data     = JSON.parse(page)
    code     = response.getResponseCode();

  }catch(e){

    return "Error: " + e;

  }

  if (code == 200) 
    return "IP: " + data.ip + " Location: " + data.city + ", " + data.region + " " + data.postal; 
  else
    return "URL Issue: Response (" + code + ")";



}

// Grabs the meta desctiption from a url
function getDescription(url, followredirect)
{

  if (!url) return "";

  followredirect = followredirect? true : false; 

  var response,code,page,match; 

  try{
    response = UrlFetchApp.fetch(url, {muteHttpExceptions: true, followRedirects: followredirect });
    page     = response.getContentText();
    code     = response.getResponseCode();
    match    = page.match(/meta\s+name=\"description\"\s+content=\"([^<]*)\"/i)[1];

  }catch(e){

    return "Error: " + e;

  }

  if (code == 200) 
    return match; 
  else
    return "URL Issue: Response (" + code + ")";

}


// Grabs the <title> tag from a url
function getTitle(url, followredirect)
{

  if (!url) return "";

  followredirect = followredirect? true : false; 

  var response,code,page,match; 

  try{

    response = UrlFetchApp.fetch(url, {muteHttpExceptions: true, followRedirects: followredirect });
    page     = response.getContentText();
    code     = response.getResponseCode();
    match    = page.match(/<title>([^<]*)<\/title>/i)[1];

  }catch(e){

    return "Error: " + e;

  }


  if (code == 200) 
    return match; 
  else
    return "URL Issue: Response (" + code + ")";

}


function convertDate(text){

  var date = new Date(text);
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();

}

function todayDate(){

  var date = new Date();
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();

}

function getUA(){

  var uas = [ "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.85 Safari/537.36",
              "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
              "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
              "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0",
              "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0",
              "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36",
              "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/5.0)",
              "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 (compatible; bingbot/2.0; http://www.bing.com/bingbot.htm)",
              "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; Media Center PC",
              "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0",
              "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1",
              "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0",
              "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
              "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko"
            ]

  var len = uas.length
  var selection = Math.floor(Math.random() * len)
  //Logger.log("UA Length: " + len)
  //Logger.log("Selection: " + selection)
  //Logger.log(uas[selection])

  return uas[selection]
}



function getCache(url) {
  url = "https://webcache.googleusercontent.com/search?q=cache:" + url;

  var params = {
    muteHttpExceptions : true,
    headers:{
           "User-Agent": getUA(), 
    }
  };

  try{

  var response = UrlFetchApp.fetch(url, params);
  var code = response.getResponseCode()
  var text = response.getContentText();  
  }catch(e){

    return "Error: " + e;

  }

  if (code == 200){
    var match = text.split('as it appeared on');
    match = match[1].split('.')[0];
    if (match && match != ""){
         return "Cache Date: " + convertDate(match);
       }else{
         return "No Date Found"
       }

  }else if (code == 404){
    return "Not Cached";
  }else if (code == 503){
    return "Google Rate Limited";
  }else{
    return "Error: " + code
  }

}
