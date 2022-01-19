var express = require("express");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();

var createFolder = function (folder) {
	try {
		fs.accessSync(folder);
	} catch (e) {
		fs.mkdirSync(folder);
	}
};

var uploadFolder = `upload/${new Date().getFullYear()}${
	new Date().getMonth() + 1
}${new Date().getDate()}`;

createFolder(uploadFolder);

//实例化multer，传递的参数对象，dest表示上传文件的存储路径
let objMulter = multer({ dest: path.join(__dirname, "./upload") });
app.use(objMulter.any()); //any表示任意类型的文件
// app.use(objMulter.image())//仅允许上传图片类型
// app.use("/", express.static("./upload")); //将静态资源托管，这样才能在浏览器上直接访问预览图片或则html页面
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/index", express.static("./views/index.html"));

// 通过 filename 属性定制
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
	},
	filename: function (req, file, cb) {
		// 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
		let suffix = file.mimetype.split("/")[1]; //获取文件格式
		cb(null, file.fieldname + "-" + Date.now() + "." + suffix);
	},
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage });

// upload.single的参数 fileid是和from表单中input输入框的name属性的值保持一致
app.post(
	"/web/attachment",
	upload.any(),
	// upload.single("attachment"),
	function (req, res, next) {
		//req.body contains the text fields
		// console.log(req, '------', req.file, '------', req.body, '-------', req.file?.path);
		// res.end(req.file.buffer);
		// console.log(req.file.buffer.toString().length);
		// const name = req.file?.path;
		// console.log(req.files);
		res.send({
			code: 1,
			data: {
				attachmentId: `${Date.now()}`,
				attachmentName: `${Date.now()}.pdf`,
			},
		});
		// res.end('ok');
	}
);

app.listen(8083, "localhost", () => {
	// app.listen(8083, 'http://gw-cloud-ygzc.respool2.wmcloud-qa.com/aladdin-report-yg', () => {
	console.log("Running on http://localhost:8083");
});
