export function SocialSharing(){
    const twitterBtn = $(".btn.bg--twitter");
    const facebookBtn = $(".fb-share-button");
    const hashtags = $("article").data("hashtags");
    const PAGEURL = `http://queenswebdesignandgraphics.com${window.location.pathname}`;

    //console.log({hashtags});
    
    const setTwitterShare = () => {
        const twitterUrl = "https://twitter.com/share?";
        const title = $("[data-social-title]").length ? $("[data-social-title]") : $(".article__title h1");
        //console.log({title});
        const text = `text=${title.text()}`
        
        const url = twitterUrl + text + "&amp;url=" + PAGEURL + "&amp;hashtags=" + hashtags
        $(twitterBtn).attr("href", url);
    }

    const setFacebookShare = () => {
        // const url = encodeURIComponent(window.location.href)
        // facebookBtn.find("a").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + url + "&amp;src=sdkpreparse");
        // $("body").append("<div id='fb-root'></div>")
        //console.log({PAGEURL})
        facebookBtn.attr("data-href", PAGEURL)
        loadFBScript(document, 'script', 'facebook-jssdk')
    }

    function loadFBScript(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
        fjs.parentNode.insertBefore(js, fjs);
      }

    return {
        init: () => {
            setTwitterShare();
            setFacebookShare();
        }
    }
    
}
