const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class UsernameDisplay extends Plugin {
  constructor(...args){
    super(...args);
    this.log('Loading listeners');
    this.messageGroupBind = this.messageGroup.bind(this);
    window.A.Watcher.on('messageGroup', this.messageGroupBind);
    window.A.Watcher.on('message', this.messageGroupBind);
    this.processBind = this.process.bind(this);
    window.DI.StateWatcher.on('mutation', this.processBind);
  }

  unload() {
    window.A.Watcher.removeListener('messageGroup', this.messageGroupBind);
    window.A.Watcher.removeListener('message', this.messageGroupBind);
  }

  static getReactInstance (node) { return node[ Object.keys(node).find((key) => key.startsWith("__reactInternalInstance")) ] }

  messageGroup(event) {

    var usernameElement = event.element.querySelector(".user-name");

    if (usernameElement.innerHTML === event.message.author.username){
      return;
    }

    var parentElement = usernameElement.parentElement;

    if (parentElement.querySelector(".username-tag") != undefined){
      return;
    }

    //this.log(element.innerHTML);

    var usernameTagNode = document.createElement("SPAN");

    usernameTagNode.innerHTML = `${event.message.author.username}#${event.message.author.discriminator}`;

    usernameTagNode.classList.add("username-tag");

    usernameTagNode.style.backgroundColor = usernameElement.style.color;
    usernameTagNode.style.color = "#FFFFFF";
    usernameTagNode.style.flexShrink = "0";
    usernameTagNode.style.borderRadius = "3px";
    usernameTagNode.style.fontSize = "12px";
    usernameTagNode.style.lineHeight = "16px";
    usernameTagNode.style.marginLeft = "6px";
    usernameTagNode.style.padding = "1px 2px";
    usernameTagNode.style.verticalAlign = "bottom";

    parentElement.appendChild(usernameTagNode);

    //this.log(event.message.author.username);
  }

  process(force){

    $(".chat .comment").each((i, group) => {
      try{
        //let author = UsernameDisplay.getReactInstance(group).memoizedProps.children[ 0 ][ 0 ].props.message.author;

        var names = $("strong.user-name", group).each((i, usernameElement) => {

          var parentElement = usernameElement.parentElement;

          if (parentElement.querySelector(".username-tag") != undefined){
            return;
          }

          var regexUserId = /https:\/\/cdn.discordapp.com\/avatars\/([0-9]+)\//i;

          var avatarElement = group.parentElement.querySelector(".avatar-large");
          var match = avatarElement.style.backgroundImage.match(regexUserId)[1];

          let user = window.DI.Helpers.resolveMention(`<@${match}>`);

          if (usernameElement.innerHTML === user.username){
            return;
          }

          //this.log(element.innerHTML);

          var usernameTagNode = document.createElement("SPAN");

          usernameTagNode.innerHTML = `${user.username}#${user.discriminator}`;

          usernameTagNode.classList.add("username-tag");

          usernameTagNode.style.backgroundColor = usernameElement.style.color;
          usernameTagNode.style.color = "#FFFFFF";
          usernameTagNode.style.flexShrink = "0";
          usernameTagNode.style.borderRadius = "3px";
          usernameTagNode.style.fontSize = "12px";
          usernameTagNode.style.lineHeight = "16px";
          usernameTagNode.style.marginLeft = "6px";
          usernameTagNode.style.padding = "1px 2px";
          usernameTagNode.style.verticalAlign = "bottom";

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