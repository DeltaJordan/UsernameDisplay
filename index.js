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