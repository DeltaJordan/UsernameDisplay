const { Plugin } = require('elements')
const $ = require('jquery');

module.exports = class UsernameDisplay extends Plugin {
  /**
   * Contains all the loading logic, that does not depend on the DOM or other plugins
   */
  preload () {}
  /**
   * Contains all the loading logic, that does depend on the DOM or other plugins
   */
  load () {
    this.processBind = this.process.bind(this);
    this.r = (this.react = this.manager.get('react'));
    this.r.on('mutation', this.processBind)
  }
  /**
   * Stuff to do on unload (e.g. freeing resources, timers and event handlers)
   */
  unload () {
    this.r.removeListener('mutation', this.processBind);
  }

  process(force){

    $(".chat .comment").each((i, group) => {
      try{

        // this.log((0.299*R + 0.587*G + 0.114*B));

        var names = $("strong.user-name", group).each((i, usernameElement) => {

          var parentElement = usernameElement.parentElement;

          if (parentElement.querySelector(".username-tag") != undefined){
            return;
          }

          const rInst = this.r.getReactInstance(parentElement.closest(".message-group"));
          const avatar = rInst.memoizedProps
          ? rInst.memoizedProps.children[0]
          : rInst.props.children[0];
          let user = null;
          try {
            const avatarProps = avatar.props.children;

            user = avatarProps.memoizedProps
              ? avatarProps.memoizedrops.user
              : avatarProps.props.user;
          } catch (err) {
            this.error('failed to fetch the user', user, err);
            return;
          }

          if (usernameElement.innerHTML === user.username){
            return;
          }

          // this.log(element.innerHTML);

          var usernameTagNode = document.createElement("SPAN");

          usernameTagNode.innerHTML = `${user.username}#${user.discriminator}`;

          usernameTagNode.classList.add("username-tag");

          // this.log(`${user.username}:${usernameElement.style.color}`);

          usernameTagNode.style.backgroundColor = usernameElement.style.color;

          if (isEmptyOrSpaces(usernameElement.style.color)){
            usernameTagNode.style.backgroundColor = "rgb(255, 255, 255)";
            usernameTagNode.style.color = "rgb(0, 0, 0)";
          }
          else {
            var regex = /[0-9]+/gi;

            var matchColors = usernameElement.style.color.match(regex);

            if (matchColors.length < 3){
              return;
            }

            var textColor = "rgb(255, 255, 255)";

            // this.log(`backgroundColor: ${usernameElement.style.color}`)
            if (matchColors[0]){
              // this.log(`Match 1: ${matchColors[0]}`);
              var R = parseInt(matchColors[0]);
              if (matchColors[1]){
                // this.log(`Match 2: ${matchColors[1]}`);
                var G = parseInt(matchColors[1]);
                if (matchColors[2]){
                  // this.log(`Match 3: ${matchColors[2]}`);
                  var B = parseInt(matchColors[2]);
                  if ((0.299*R + 0.587*G + 0.114*B) > 176){
                    // this.log((0.299*R + 0.587*G + 0.114*B));
                    textColor = "rgb(0, 0, 0)";
                  }
                }
              }
            }

            usernameTagNode.style.color = textColor;
          }

          parentElement.appendChild(usernameTagNode);

        });
      }
      catch (err) {
        console.error(err);
      }
    });
  }
}

function isEmptyOrSpaces(str){
  return str === null || str.match(/^ *$/) !== null;
}