let nowIndex = 0;
let isLoading = false;

function getData(cb) {
    const clientId = '1uite112wxwjvd0gk7lv9n3q8qxe3q';
    const limit = 18;
    const game = 'NBA%202K18'
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
    xhr.open('GET', `https://api.twitch.tv/kraken/streams/?client_id=${clientId}&game=${game}&limit=${limit}&offset=${nowIndex}`, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            // 狀態碼 status success
            var res = xhr.responseText;
            cb(null, JSON.parse(res));
        } else {
            callBack(new Error('xhr not ready or status not equal to 200'));
        }
    };
    xhr.send();
}

function appendData() {
    getData((err, data) => {
        if (err) {
            console.log(err);
        } else {
            const { streams } = data;
            // const streams = data.streams; 的 es6 寫法

            // const $row = $('.row');
            const $row = document.querySelector('.row');
            for (let stream of streams) {
                // $row.append(getColumn(stream));
                const div = document.createElement('div');
                $row.appendChild(div);
                div.outerHTML = getColumn(stream); // outerHTML 會替換掉整個 div(上面新增的)
            }
            // // 排版需求
            // $row.append(
            //     `<div class="col"></div>
            //     <div class="col"></div>`
            // );
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
    appendData();
    window.addEventListener('scroll', () => {
        if (scrollTop() + window.innerHeight >= documentHeight() - 150) {
            if (!isLoading) {
                appendData();
            }
        }
    });
});