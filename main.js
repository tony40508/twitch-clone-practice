let nowIndex = 0;
let isLoading = false;

function getData(cb) {
    const clientId = '1uite112wxwjvd0gk7lv9n3q8qxe3q';
    const limit = 18;
    const game = 'NBA%202K18'
    isLoading = true;

    $.ajax({
        url: `https://api.twitch.tv/kraken/streams/?client_id=${ clientId }&game=${ game }&limit=${ limit }&offset=${ nowIndex }`,
        success: (res) => {
            // console.log(res);
            cb(null, res); // res 透過 callback 帶回去，success 僅處理 API 有關的事情（切分邏輯）
        },
        error: (err) => {
            cb(err);
        }
    })
}

function appendData() {
    getData((err, data) => {
        if (err) {
            console.log(err);
        } else {
            const { streams } = data;
            // const streams = data.streams; 的 es6 寫法
            const $row = $('.row');

            for (let stream of streams) {
                $row.append(getColumn(stream));
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

$(document).ready(() => {
    appendData();
    $(window).scroll(() => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 150) {
            if (!isLoading) {
                appendData();
            }
        }
    })
})
