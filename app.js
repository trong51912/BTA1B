var http = require("http");
var fs = require("fs");
var qs = require('querystring');
var vehiclePlates = JSON.parse(fs.readFileSync(__dirname + "/vehicle_plates.json"));
var idx = 1;
vehiclePlates.forEach(vp => { 
  vp.id = idx++;
}); // Do file data json mình chưa thêm id, nên mình tạm xử lý id cho data ở đây để thuận tiện việc tìm kiếm.

http.createServer(function(req, res) {
  if (req.url === "/" || req.url === "/index.html") {//Nếu req từ root hoặc /index.html thì sẽ chuyển đến giao diện chính
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    fs.createReadStream(__dirname + "/index.html").pipe(res);
  } else if (req.url === "/api/vehicle_plates/cities") {//url dùng để request json lấy dữ liệu build select2 cities.
    console.log("request to cities");
    
    var cities = [];
    var idx = 1;
    vehiclePlates.forEach(vp => { 
      cities.push({id: vp.id, text: vp.city});
    }); 

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(cities));
    res.end();
  } else if (req.url === "/api/vehicle_plates/findCityPlate") {//url dùng để tìm kiếm biển số xe theo id của tỉnh thành được lựa chọn ở client
    console.log("request to city plate");
    var result = "";
    var body='';
    var params = "";

    req.on('data', function (data) {//phần này dùng để lấy params truyền từ method POST.
        body +=data;
    }).on('end', function (data) {
      params = qs.parse(body);
      vehiclePlates.forEach(vp => { 
        if (vp.id == params.id) {
          console.log("found");
          result = vp.plate_no;
          return false;
        }
      }); 
      res.end(result);
    });
  } else {// các request khác không thuộc các url trên sẽ hiển thị nội dung này
    res.writeHead(404, {'Content-Type': "text/plain-text"});
    res.end("Not found the page you requested.");
  }
}).listen(3000);

console.log("Listening on port 3000... ");