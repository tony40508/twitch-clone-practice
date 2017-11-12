import en from "./lang-en"
import jp from "./lang-jp"
import tw from "./lang-zh-tw"

const I18N = {
    'en': en,
    'zh-tw': tw,
    'jp': jp
}

let nowIndex = 0;
let isLoading = false;
let LANG = 'en'

document.querySelector('.enBtn').addEventListener('click', changeLang);
document.querySelector('.twBtn').addEventListener('click', changeLang);
document.querySelector('.jpBtn').addEventListener('click', changeLang);
// const $row = $('.row');
const $row = document.querySelector('.row');

function changeLang(e) { 
    document.querySelector('.enBtn').classList.remove('selected');
    document.querySelector('.twBtn').classList.remove('selected');
    document.querySelector('.jpBtn').classList.remove('selected');

    var e = event.target;
    e.classList.toggle('selected');
    let getAttr = e.getAttribute('data-selectedLang');

    if (getAttr === 'en' || getAttr === 'zh-tw' || getAttr === 'jp') {
        nowIndex = 0;
        document.querySelector(".title").innerHTML = I18N[getAttr].TITLE;
        LANG = getAttr;
        $row.innerHTML = "";
        appendData(LANG);
    }
}

function getData(lang, cb) {
    const clientId = '1uite112wxwjvd0gk7lv9n3q8qxe3q';
    const limit = 19;
    // const game = 'NBA%202K18';
    const game = 'League of Legends';
    isLoading = true;

    // $.ajax({
    //     url: `https://api.twitch.tv/kraken/streams/?client_id=${ clientId }&game=${ game }&limit=${ limit }&offset=${ nowIndex }`,
    //     success: (res) => {
    //         // console.log(res);
    //         cb(null, res); // res 透過 callback 帶回去，success 僅處理 API 有關的事情（切分邏輯）
    //     },
    //     error: (err) => {
    //         cb(err);
    //     }
    // })

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.twitch.tv/kraken/streams/?client_id=${clientId}&game=${game}&limit=${limit}&offset=${nowIndex}&language=${lang}`, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            // 狀態碼 status success
            var res = xhr.responseText;
            cb(null, JSON.parse(res));
        } else {
            cb(new Error('xhr not ready or status not equal to 200'));
        }
    };
    xhr.send();
}

function appendData(lang) {
    getData(lang, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const { streams } = data;
            // const streams = data.streams; 的 es6 寫法
            for (let stream of streams) {
                // $row.append(getColumn(stream));
                const div = document.createElement('div');
                $row.appendChild(div);
                div.outerHTML = getColumn(stream); // outerHTML 會替換掉整個 div(上面新增的)
            }
            // if (streams.length == 1 || 2) {
            //     // 排版需求
            //     const div1 = document.createElement('div');
            //     const div2 = document.createElement('div');
            //     $row.appendChild(div1);
            //     $row.appendChild(div2);
            //     div1.classList.add('utilityCol');
            //     div2.classList.add('utilityCol');
            // }
            nowIndex += 10;
            isLoading = false;
        }
    });
}


function getColumn(data) {
    return `
        <div class="col">
            <div class="preview">
                <img src="${data.preview.medium}" onload="this.style.opacity = 1" />
            </div>
            <div class="bottom">
                <div class="avatar">
                    <img src="${data.channel.logo}" onload="this.style.opacity = 1" />
                </div>
                <div class="intro">
                    <div class="channel_name">
                        ${data.channel.status}
                    </div>
                    <div class="owner_name">
                        ${data.channel.display_name}
                    </div>
                </div>
            </div>
        </div>`;
}

// $(document).ready(() => {
//     appendData();
//     $(window).scroll(() => {
//         if ($(window).scrollTop() + $(window).height() >= $(document).height() - 150) {
//             if (!isLoading) {
//                 appendData();
//             }
//         }
//     })
// })


// 要解決瀏覽器兼容性，為什麼用 jquery 的原因
function documentHeight() {
    var body = document.body;
    var html = document.documentElement;
    return Math.max(
        body.offsetHeight,
        body.scrollHeight,
        html.clientHeight,
        html.offsetHeight,
        html.scrollHeight
    );
}

function scrollTop() {
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}

document.addEventListener("DOMContentLoaded", () => {
    appendData(LANG);
    window.addEventListener('scroll', () => {
        if (scrollTop() + window.innerHeight >= documentHeight() - 150) {
            if (!isLoading) {
                appendData(LANG);
            }
        }
    });
});
