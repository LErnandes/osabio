var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var scraper = require('google-search-scraper');
var Scraper = require('images-scraper'),
  yahoo = new Scraper.Yahoo();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { text: 'Posso lhe oferecer todo meu conhecimento', disi: 'none', dist: 'none', disf: 'none' });
});

router.get('/:id', function (req, res, next) {
  res.render('index', { text: req.params.id });
});

router.post('/', function (req, res, next) {
  try {
    if (req.body.perg.indexOf('pesquise ') == 0) {
      var perg = req.body.perg.replace('pesquise ', '');
      var options = {
        query: perg + ' brainly',
        lang: 'pt-br',
        limit: 10,
        params: {}
      };

      var i = 0;
      scraper.search(options, function (err, url) {
        try {
          var ver = url.indexOf('brainly.com.br');
          if (ver != 1 && i == 0) {
            request(url, function (error, response, html) {
              if (!error && response.statusCode == 200) {
                var i = cheerio.load(html);
                res.render('index', { text: i('div.sg-text.js-answer-content.brn-rich-content').text(), disi: 'none', dist: 'block', disf: 'none' });
              }
            });
            i += 1;
          }
        } catch (err) {
          console.log('Algo deu errado');
          console.log(err);
        }
      });
    } else if (req.body.perg.indexOf('imagem ') == 0) {
      var quan = 1;
      var perg = req.body.perg.replace('imagem ', '');
      yahoo.list({
        keyword: perg,
        num: quan,
      }).then(function (respos) {
        var i = 0;
        while (i < quan) {
          res.render('index', { text: respos[i].url, disi: 'block', dist: 'none', disf: 'none' });
          i += 1;
        }
      }).catch(function (err) {
        console.log('err', err);
      });
    } else if (req.body.perg.indexOf('defina ') == 0) {
      var perg = req.body.perg.replace('defina ', '');
      var options = {
        query: perg + ' wikipedia',
        lang: 'pt-br',
        limit: 10,
        params: {}
      };

      var i = 0;
      scraper.search(options, function (err, url) {
        try {
          var ver = url.indexOf(' wikipedia.org');
          if (ver != 1 && i == 0) {
            request(url, function (error, response, html) {
              if (!error && response.statusCode == 200) {
                var i = cheerio.load(html);
                res.render('index', { text: i('div.mw-parser-output p').first().text(), disi: 'none', dist: 'block', disf: 'none' });
              }
            });
            i += 1;
          }
        } catch (err) {
          console.log('Algo deu errado');
          console.log(err);
        }
      });
    } else if (req.body.perg.indexOf('youtube ') == 0) {
      var perg = req.body.perg;
      var options = {
        query: perg,
        lang: 'pt-br',
        limit: 10,
        params: {}
      };

      var i = 0;
      scraper.search(options, function (err, url) {
        try {
          var ver = url.indexOf(' youtube.com');
          if (ver != 1 && i == 0) {
            url = url.replace('watch?v=', 'embed/');
            res.render('index', { text: url, disi: 'none', dist: 'none', disf: 'block' });
          }
          i += 1;
        } catch (err) {
          console.log('Algo deu errado');
          console.log(err);
        }
      });
    } else if (req.body.perg.indexOf('twitch ') == 0) {
      var url = 'https://player.twitch.tv/?channel=' + req.body.perg.replace('twitch ', '');
      res.render('index', { text: url, disi: 'none', dist: 'none', disf: 'block' });
    }
  } catch (err) {
    res.render('index', { text: 'Não consegui achar', disi: 'none', dist: 'block', disf: 'none' });
  }
});

module.exports = router;
