const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class UsernameDisplay extends Plugin {
  constructor(...args){
    super(...args);
    this.log('Loading listeners...');
    this.processBind = this.process.bind(this);
    window.DI.StateWatcher.on('mutation', this.processBind);
  }

  unload() {
    window.Di.StateWatcher.removeListener('mutation', this.processBind);

    $(".chat .comment").each((i, group) => {
      var names = $(".username-tag", group).each((i, usernameTagElement) => {
        usernameTagElement.parentElement.removeChild(usernameTagElement);
      });
    });
  }

  process(force){

    $(".chat .comment").each((i, group) => {
      try{

        //this.log((0.299*R + 0.587*G + 0.114*B));

        var names = $("strong.user-name", group).each((i, usernameElement) => {

          var parentElement = usernameElement.parentElement;

          if (parentElement.querySelector(".username-tag") != undefined){
            return;
          }

          // Small hack until XClass works on channel switch ;P
          var regexUserId = /https:\/\/cdn.discordapp.com\/avatars\/([0-9]+)\//i;

          var avatarElement = group.parentElement.querySelector(".avatar-large");
          var match = avatarElement.style.backgroundImage.match(regexUserId);

          if (!match){
            return;
          }

          //this.log(match);

          var userIdString = match[1];

          let user = window.DI.Helpers.resolveMention(`<@${userIdString}>`);

          if (usernameElement.innerHTML === user.username){
            return;
          }

          //this.log(element.innerHTML);

          var usernameTagNode = document.createElement("SPAN");

          usernameTagNode.innerHTML = `${user.username}#${user.discriminator}`;

          usernameTagNode.classList.add("username-tag");

          usernameTagNode.style.backgroundColor = usernameElement.style.color;

          var regex = /[0-9]+/gi;

          var matchColors = usernameElement.style.color.match(regex);

          var textColor = "rgb(255, 255, 255)";

          /*this.log(`backgroundColor: ${usernameElement.style.color}`)
          if (matchColors[0]){
            this.log(`Match 1: ${matchColors[0]}`);
            var R = parseInt(matchColors[0]);
            if (matchColors[1]){
              this.log(`Match 2: ${matchColors[1]}`);
              var G = parseInt(matchColors[1]);
              if (matchColors[2]){
                this.log(`Match 3: ${matchColors[2]}`);
                var B = parseInt(matchColors[2]);
                if ((0.299*R + 0.587*G + 0.114*B) > 176){
                  this.log((0.299*R + 0.587*G + 0.114*B));
                  textColor = "rgb(0, 0, 0)";
                }
              }
            }
          }*/

          usernameTagNode.style.color = textColor;

          parentElement.appendChild(usernameTagNode);
        });
      }
      catch (err) {
        console.error(err);
      }
    });
  }
}

module.exports = UsernameDisplay;