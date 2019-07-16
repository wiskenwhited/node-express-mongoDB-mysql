var config = require('config');
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var expressJwt = require('jsonwebtoken');
var authHelper = require('../helpers/auth-helper');
// router.use();
// routes
router.post('/brandLogos',  brandLogoUpload);
router.post('/seriesLogos', seriesLogoUpload);
router.post('/carTypeLogos', carTypeLogoUpload);
router.post('/userProfiles', userProfileUpload);
router.post('/carImages', carImageUpload);
router.post('/headerBanner1', headerBannerImage1);
router.post('/headerBanner2', headerBannerImage2);
router.post('/headerBanner3', headerBannerImage3);
router.post('/headerBanner4', headerBannerImage4);
router.post('/headerBanner5', headerBannerImage5);
router.post('/suggestionImages/', suggestiveCarImage);

module.exports = router;

function showImages(req, res) {
  file = req.params.file;
  var img = fs.readFileSync(path.join(config.uploadPath, file));
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
}

function brandLogoUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.logoImage;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'logos/' + sampleFile.name), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}

function seriesLogoUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.seriesLogoImage;
  
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'seriesLogos/' + sampleFile.name), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}

function carTypeLogoUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.carTypeLogoImage;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'carTypeLogos/' + sampleFile.name), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}

function userProfileUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.userProfileImage;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'userProfiles/' + sampleFile.name), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}

function headerBannerImage1(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.headerBannerImage;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'headerBanner/home-banner-1' + path.extname(sampleFile.name)), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}

function headerBannerImage2(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.headerBannerImage;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'headerBanner/home-banner-2' + path.extname(sampleFile.name)), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}

function headerBannerImage3(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.headerBannerImage;
  
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'headerBanner/home-banner-3' + path.extname(sampleFile.name)), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}
function headerBannerImage4(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.headerBannerImage;
  
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'headerBanner/sellcar-header-image' + path.extname(sampleFile.name)), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}
function headerBannerImage5(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.headerBannerImage;
  
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv(path.join(config.uploadPath, 'headerBanner/sellcar-progress-image' + path.extname(sampleFile.name)), function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
}


function suggestiveCarImage(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  var suggestionOrder = req.body.suggestionOrder;
  var sampleFile = [];
  var fileUrls = [];
  sampleFile.push(req.files.uploads);
  file = sampleFile[0];
      file.mv(path.join(config.uploadPath, 'headerBanner/suggestion-car-' + suggestionOrder + path.extname(file.name)), function(err) {
        if (err)
          return res.status(500).send(err);
        else {
          fileUrls.push({imagePath: path.join(config.uploadPath, 'headerBanner/suggestion-car-' + suggestionOrder + path.extname(file.name))})
          res.send({'result': 'OK', 'imagePath': fileUrls});    
        }
      });

}

function carImageUpload(req, res) {
  if (!req.files) {
    return res.status(400).send({'result': 'Fail', 'error': 'No files were uploaded.'});
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let uploadFiles = [];
  if (!req.files.uploads.length)
    uploadFiles.push(req.files.uploads);
  else
    uploadFiles = req.files.uploads;

  // check if there is user directory and make dir if not exist
  var dir = path.join(config.uploadPath, 'carImages/' + req.body.userId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  dir += ('/' + req.body.carId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  
  // Use the mv() method to place the file somewhere on your server 
  var error;
  i = 0;
  var fileUrls = [];
  
  for (var i in uploadFiles) {
    file = uploadFiles[i];
    var fileName = req.body.carId + i + path.extname(file.name);
    file.mv(dir + '/' + fileName, function(err) {
      if (err) {
        error = err;
      }
    });
    if (error)
      break;
    else
      fileUrls.push({imagePath: fileName});
  }

  if (error) {
    return res.status(500).send({'result': 'Fail', 'error': error});
  }
  else {
    res.send({'result': 'OK', 'imagePath': fileUrls});    
  }
}



