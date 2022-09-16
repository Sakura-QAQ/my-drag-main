
//获取页面数据
async function getPageData() {
    let data = await fetch('../../public/pageData.json').then(res => {
        return res.json();
    })
    createPage(data);
    console.log(data);
}
getPageData();


//页面创建函数
function createPage(pageData) {
    createLayout(pageData);
}

//布局创建函数window.
function createLayout(data) {
    let rowStr = "";
    let colObj = {};

    //生成row
    data.forEach((row, rowIndex) => {
        rowStr = rowStr + `<div class="row${rowIndex}" style="width:100%;height:${row.initHeight}px;display:${row.display};justify-content:${row.justifyContent};margin:${row.margin}"></div>`
        colObj[rowIndex] = row.children;
    });
    let wrap = document.getElementsByClassName("wrap")[0];
    wrap.innerHTML = rowStr;

    //生成col
    for (let prop in colObj) {
        let newCol = colObj[prop].map((col) => {
            if (col.data.type === "chart") {
                createEchart(col.data.id, col.data.chartData)
            } else if (col.data.type === "table") {
                createTable(col.data.id, col.data.tableHead, col.data.tableBody, col.data.style)
            }
            let colStr = `<div style="width:${parseInt((col.initCol*100)/24)}%;height:100%;border:${col.border};border-radius:${col.borderRadius};margin:${col.margin};background-color:${col.backgroundColor}"><div id="${col.data.id}" style="width:100%;height:100%"></div></div>`
            return colStr;
        })
        colObj[prop] = newCol.join("");
        //生成布局
        let row = document.getElementsByClassName("row" + prop)[0];
        row.innerHTML = colObj[prop];
    }
}

//生成echart
function createEchart(id, option) {
    setTimeout(() => {
        let myChart = echarts.init(document.getElementById(id));
        myChart.setOption(option);
    }, 0)
}

//生成表格
function createTable(id, head, body, style) {
    let table = document.createElement("table");
    let headTr = document.createElement("tr");
    head.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item.label;
        headTr.appendChild(th);
        th.style.borderBottom = style.head.border;
        th.style.padding = style.head.padding;
        th.style.textAlign = style.head.textAlign;
        th.style.color = style.head.color;
        th.style.fontSize = style.head.fontSize;
    })
    table.appendChild(headTr);

    body.forEach((i) => {
        let bodyTr = document.createElement("tr");
        for (let prop in i) {
            let td = document.createElement("td");
            td.innerText = i[prop];
            bodyTr.appendChild(td);
            td.style.borderBottom = style.body.border;
            td.style.padding = style.body.padding;
            td.style.textAlign = style.body.textAlign;
            td.style.color = style.body.color;
            td.style.fontSize = style.body.fontSize;
        }
        table.appendChild(bodyTr);
    })
    //table不变样式
    table.style.width = "100%";
    table.style.overflow = "auto";
    table.style.borderSpacing = "0";
    setTimeout(() => {
        let container = document.getElementById(id)
        container.appendChild(table);
    }, 0);
}