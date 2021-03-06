const gitbook_setup = require('gitbook-setup')
const ModernDocManager = require('./ModernDocManager.js')

const electron = require('electron')
const remote = electron.remote
var fs = require('fs.extra');
var shell = require('shelljs');
var exec = require('child_process').exec;
var path = require('path')
const mainProcess = remote.require('./main.js')

/*document.getElementById('createButton').addEventListener('click', _ => {

})
*/

class GitbookSetupManager {
  static createDoc () {
      $('.dimmer.create.ui').addClass('active')
      var title = $('#title')[0].value;
      var author = $('#author')[0].value.split(",");
      var type = actual_type_checked;
      console.log("Actual type checked: " + type);
      var template;
      if (type == "other") {
        template = $('#template_name')[0].value;
      }
      else {
        template = type;
      }

      var info = {
        'name': title,
        'authors': author,
        'template': template,
        'deploys': deployments
      }

      if (is_private) {
        info['private'] = 'yes';
        info['organization'] = $('#organization').val();
      }
      else {
        info['private'] = 'no';
      }

      console.log(info);
      mainProcess.selectDirectory(function (dir_path) {
        gitbook_setup.create(info, function(err, fixedContent) {
          if (err) console.log(err);
          else {
            var wantedPath = path.join(dir_path, fixedContent.name)
            fixedContent['path'] = wantedPath;
            $('.dimmer.create.ui').removeClass('active')
            ModernDocManager.addDocument(fixedContent);
            $('.ui.success.create.message.hidden').removeClass('hidden');
            var oldSuccessText  = $('.header.create.message').text();
            $('.header.create.message').text(oldSuccessText.replace("document","document " + fixedContent.name));
            setTimeout(() => {
              $('.ui.success.create.message').transition('fade');
            },5000);
            setTimeout(() => {
              exec ('cd ..', (err, out) => {
                fs.mkdirp(wantedPath, function (err) {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log('moved to ' + wantedPath)
                  }
                });
                fs.rename(path.join(process.cwd(),info.name), wantedPath, () => {
                  console.log("movido");
                });
              });
            },100);
          }
        })
      });
  }

  static install () {
    $('.dimmer.install.ui').addClass('active')
    gitbook_setup.install((err, message) => {
      if (message) $('.ui.indeterminate.text.loader').html(message);
      else if (err)  {
        console.log(err);
        $('.dimmer.install.ui').removeClass('active')
      }
      else if (!message && !err){
        $('.dimmer.install.ui').removeClass('active')
      }
    })
  }


}


module.exports = GitbookSetupManager;
