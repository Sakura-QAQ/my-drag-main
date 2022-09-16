<!--
 * @Description: 中间显示的布局内容。必须至少一行布局才能继续拖拽添加。
 -->
<template>
    <div class="ps-r report-container">
        <!-- 主要布局 -->
        <div class="mr-center report">
            <!-- 布局 -->
            <div class="ps-r flex flex-center flex-nowrap layout-row"
                 v-for="(row, rowIndex) in dragReportData"
                 :key="rowIndex"
                 :style="rowStyle(row)"
                 @drop="handleDropRow($event, row)"
                 @dragover="handleDragOver($event, row)"
                 @mouseenter="row.showControllerBar = true"
                 @mouseleave="row.showControllerBar = false">
                <!-- 顶部弹出条 -->
                <transition name="slide-fade">
                    <div draggable="true"
                         v-show="row.showControllerBar"
                         @dragstart="handleDragRow($event, row)"
                         class="flex flex-center cur-all w100 ps-a border-r5 row-controller-bar">
                        <div class="bar-btn-box">
                            <span class="align-type-item cur-p color-danger"
                                  @click="handleRemoveRow($event, row)">
                                <i class="el-icon-delete-solid"
                                   title="删除当前布局"></i>
                            </span>
                            <span title="移动布局">
                                <i style="width:15px;height:1px;display:block;border:1px solid #f44336;margin:3px;"></i>
                                <i style="width:15px;height:1px;display:block;border:1px solid #f44336;margin:3px"></i>
                                <i style="width:15px;height:1px;display:block;border:1px solid #f44336;margin:3px"></i>
                            </span>
                        </div>
                    </div>
                </transition>

                <!-- 图表内容 -->
                <div class="flex flex-center ps-r border-r5 layout-col-box"
                     :class="{ 'cur-all': !!col.data.type }"
                     v-for="(col, colIndex) in row.children"
                     :style="previewColStyle({width: col.initCol,height: row.initHeight,baseHeight: 1},{border:col.border,margin:col.margin,borderRadius:col.borderRadius,backgroundColor:col.backgroundColor})"
                     :key="colIndex"
                     :draggable="col.data.type ? true : false"
                     @mouseover="col.data.type? (col.showChildrenControllerBar = true): null"
                     @mouseout="col.showChildrenControllerBar = false"
                     @dragstart="handleDragCol($event, col)"
                     @drop="handleDropCol($event, col)"
                     @dragover="handleDragOver($event, col)">
                    <!-- 图 -->
                    <div :id="col.data.id"
                         class="echartsClass"
                         v-if="col.data.type === 'chart'"></div>
                    <!-- 表格 -->
                    <div v-show="col.data.type === 'table'"
                         class="tableClass">
                        <el-table :data="col.data.tableBody"
                                  style="width: 100%"
                                  :cell-style="() => setCellStyle(col.data)"
                                  :header-cell-style="() => setHeadCellStyle(col.data)"
                                  size="small">
                            <template v-for="i in col.data.tableHead">
                                <el-table-column :prop="i.prop"
                                                 :label="i.label"
                                                 :key="i.label"></el-table-column>
                            </template>
                        </el-table>
                    </div>
                    <!-- 图表弹出条 -->
                    <transition name="slide-fade">
                        <div class="ps-a border-r5 w100 t0 flex flex-center col-controller-bar"
                             v-show="col.showChildrenControllerBar">
                            <span class="bar-title-box cur-p color-danger"
                                  @click="resetCol(col)">
                                <i class="el-icon-delete-solid"
                                   title="删除当前图表"></i>
                            </span>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <i class="cur-p ps-a t0 ps-icon-btn el-icon-plus add-row-icon"
           title="添加布局"
           :style="floatBox"
           v-show="!addRow.show"
           @click="addRow.show = true" />

        <i class="cur-p ps-a t0 ps-icon-btn el-icon-plus add-col-icon"
           title="添加图表"
           :style="floatBox"
           v-show="!addCol.show"
           @click="addCol.show = true" />

        <i class="cur-p ps-a t0 ps-icon-btn el-icon-folder-add save-icon"
           title="保存自定义页面"
           :style="floatBox"
           v-show="!addCol.show"
           @click="savePageData" />

        <transition name="slide-fade">
            <div class="flex flex-center ps-a t0 l0 drag-report-add-box"
                 :style="floatBox"
                 v-show="addRow.show"
                 @mouseenter="addRow.showControllerBar = true"
                 @mouseleave="addRow.showControllerBar = false">
                <transition name="slide-fade">
                    <div class="ps-a w100 t0 border-r5 text-r title-box"
                         v-show="addRow.showControllerBar">
                        <i class="cur-p el-icon-close"
                           @click="addRow.show = false" />
                    </div>
                </transition>

                <default-layout-editor v-clickoutside="handleClickoutside(addRow)"
                                       @drag-row-start="handleDragNewRow" />
            </div>
        </transition>

        <transition name="slide-fade">
            <div class="flex flex-center ps-a t0 r0 drag-report-add-box"
                 :style="floatBox"
                 v-show="addCol.show"
                 @mouseenter="addCol.showControllerBar = true"
                 @mouseleave="addCol.showControllerBar = false">
                <transition name="slide-fade">
                    <div class="ps-a w100 t0 border-r5 text-l title-box"
                         v-show="addCol.showControllerBar">
                        <i class="el-icon-close"
                           @click="addCol.show = false" />
                    </div>
                </transition>

                <default-framework v-clickoutside="handleClickoutside(addCol)"
                                   @drag-col-start="handleDragNewCol" />
            </div>
        </transition>
    </div>
</template>

<script>
import { debounce, cloneDeep } from "lodash";
import { diffIndex, mixinObjs } from "@/utils";
import { getInitRow, getInitCol, resetIndex } from "@/utils/dragReport";
import colStyle from "@/utils/col-style";
import clickoutside from "@/utils/clickoutside";
// import { getMyChartData } from "../static/getMyChartData.js";

import defaultFramework from "@/components/default-framework";
import defaultLayoutEditor from "@/components/default-layout-editor";
export default {
    name: "dragReport",
    components: { defaultFramework, defaultLayoutEditor },
    directives: { clickoutside },
    mixins: [colStyle],
    data() {
        return {
            currentRowId: 0,
            charts: {},
            //整体数据
            dragReportData: [
                {
                    justifyContent: "flex-start",
                    display: "flex",
                    initHeight: 300,
                    margin: "2rem 0",
                    index: 1,
                    showControllerBar: false,
                    children: [
                        {
                            initCol: 24, //列宽
                            border: "1px dashed #cccccc",
                            margin: "0 0.2rem",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            showChildrenControllerBar: false,
                            data: {},
                        },
                    ],
                },
                {
                    index: 2,
                    justifyContent: "flex-start",
                    initHeight: 300,
                    margin: "2rem 0",
                    display: "flex",
                    showControllerBar: false,
                    children: [
                        {
                            initCol: 16,
                            border: "1px dashed #cccccc",
                            margin: "0 0.2rem",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            showChildrenControllerBar: false,
                            data: {},
                        },
                        {
                            initCol: 8,
                            border: "1px dashed #cccccc",
                            margin: "0 0.2rem",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            showChildrenControllerBar: false,
                            data: {},
                        },
                    ],
                },
            ],

            // 拖动 row 和 col 的内容存储地
            dragData: {
                // 拖动的如果是 row
                isRow: false,
                // 拖动的是新的 row
                isNewRow: false,
                // 拖动的是新的 col
                isNewCol: false,
                // col 信息
                col: null,
                // row 信息
                row: null,
            },
            // alignType,
            addContainerTop: 30,
            addRow: {
                show: false,
                showControllerBar: false,
            },
            addCol: {
                show: false,
                showControllerBar: false,
            },
        };
    },
    computed: {
        floatBox() {
            return { top: `${this.addContainerTop}px` };
        },
    },
    methods: {
        setCellStyle(col) {
            if (col.type === "table") {
                return `color:${col.style.body.color};font-size:${col.style.body.fontSize};text-align:${col.style.body.textAlign};border-bottom:${col.style.body.border};background-color:${col.style.body.backColor}`;
            }
        },
        setHeadCellStyle(col) {
            if (col.type === "table") {
                return `color:${col.style.head.color};font-size:${col.style.head.fontSize};text-align:${col.style.head.textAlign};border-bottom:${col.style.head.border};background-color:${col.style.body.backColor}`;
            }
        },
        // edit row functions
        // 拖动新的 row
        handleDragNewRow(event, row) {
            this.dragData.isRow = true;
            this.dragData.isNewRow = true;
            this.dragData.row = getInitRow(row);
        },
        // 拖动已存在的 row 重排时
        handleDragRow(event, row) {
            this.dragData.isRow = true;
            this.dragData.isNewRow = false;
            this.dragData.row = row;
        },
        // 对 dropRow 的函数处理
        handleDropRow(event, drapRow) {
            if (!this.dragData.isRow) return;
            const { row: dragRow } = this.dragData;
            const rows = this.dragReportData;
            // 用来限制高度
            // let sum = rows.reduce((pre, curr) => (pre += curr.height), 0);
            if (!this.dragData.isNewRow) {
                // 如果拖拽的不是新的 row
                // 则交换两个 row 的 index，并对 rows 进行 sort
                [dragRow.index, drapRow.index] = [drapRow.index, dragRow.index];
                this.sortRows();
            } else {
                // 如果拖拽的是新的 row
                // 用来限制高度
                // if (sum + dragRow.initHeight > 2300) this.$msg("1_高度超出一页纸");
                // 找出 drapRow 后面的所有 rows，并把他们的 index + 1
                // 为的是拖拽放置的时候能放置在被 drap 的 row 后面
                rows.forEach((row) =>
                    row.index > drapRow.index ? row.index++ : null
                );
                rows.push(mixinObjs(dragRow, { index: drapRow.index + 1 }));
                this.sortRows();
            }
        },
        // 重排 rows，并会对 index 重新赋值
        sortRows() {
            const rows = this.dragReportData;
            rows.sort(diffIndex);
            rows.forEach(resetIndex);
        },
        // 删除某 row
        handleRemoveRow(event, row) {
            const rows = this.dragReportData;
            if (rows.length === 1) {
                this.$msg("1_至少需要一条布局");
                return;
            }
            rows.splice(row.index - 1, 1);
            this.sortRows();
        },

        // edit col functions
        handleDragOver(event) {
            // 默认情况下，对于 drop 的元素，要使用 dragover 移除默认事件，event.preventDefault()
            event.preventDefault();
        },

        // 拖动一个新的 col
        handleDragNewCol(event, col) {
            this.dragData.isRow = false;
            this.dragData.isNewCol = true;
            this.dragData.col = col;
            // 把布局盒子隐藏，方便排版
            this.addCol.show = false;
        },
        // 拖动一个已存在布局中的 col
        handleDragCol(event, col) {
            this.dragData.isRow = false;
            this.dragData.isNewCol = false;
            this.dragData.col = col;
        },
        // 放置一个 col
        handleDropCol(event, col) {
            // 如果拖动的是 row，不用管
            if (this.dragData.isRow) return;
            const dragCol = this.dragData.col; //得道传过来的图表数据
            let cloneCol = cloneDeep(col);
            let cloneDragCol = cloneDeep(dragCol);
            if (!this.dragData.isNewCol) {
                // 若拖动的 col 不是新 col
                // 有两种情况要考虑，一个是放置的位置没有 col
                // 一个是放置的位置有 col
                if (col.data.chartData || col.data.tableHead) {
                    // 若放置的位置不是空的，则将两者交换
                    this.setCol(dragCol, col);
                    // this.setCol(cacheCol, dragCol);
                } else {
                    // 若放置的位置是空的，则将 col 赋值并重置 from
                    this.setCol(dragCol, col);
                    // this.setCol(dragCol, col);
                    // this.resetCol(dragCol);
                }
            } else {
                // 若拖动的 col 是新的 col
                // 则只需要将 col 赋值即可
                // console.log(col);
                // console.log(dragCol, col);
                this.setCol(cloneDragCol, col);
                this.addCol.show = true;
            }
        },
        delCol(col) {
            col.data = {};
        },
        setCol(from, to) {
            if (!from.data) {
                if (to.data.chartData) {
                    this.charts[to.data.id].clear();
                }
                to.data = from;
                this.createsChart(to);
                // console.log(this.charts);
                return;
            }

            if (from.data.chartData) {
                this.charts[from.data.id].clear();
            }
            if (to.data.chartData) {
                this.charts[to.data.id].clear();
            }
            [from.data, to.data] = [to.data, from.data];
            this.createsChart(from);
            this.createsChart(to);
        },
        resetCol(col) {
            let init = getInitCol({
                initCol: col.initCol,
            });
            this.delCol(col);
            // this.setCol(init, col);
        },
        // other function
        rowStyle(row) {
            return {
                justifyContent: row.justifyContent,
                height: `${row.initHeight}px`,
                display: row.display,
                margin: row.margin,
            };
        },
        handleClickoutside(container) {
            return function () {
                container.show && (container.show = false);
            };
        },
        handleListenerScroll(e) {
            let scrollTop =
                document.documentElement.scrollTop ||
                window.pageYOffset ||
                document.body.scrollTop;
            this.addContainerTop = scrollTop + 30;
        },
        addListener() {
            this.$$listeners = { scroll: null };
            this.$$listeners.scroll = debounce(this.handleListenerScroll, 10);
            window.addEventListener("scroll", this.$$listeners.scroll);
        },
        //创建echarts
        createsChart(nowCol) {
            this.$nextTick(() => {
                if (nowCol.data.chartData) {
                    let myChart = this.$echarts.init(
                        document.getElementById(nowCol.data.id)
                    );
                    this.charts[nowCol.data.id] = myChart;
                    myChart.setOption(nowCol.data.chartData);
                }
            });
        },
        //保存页面数据
        savePageData() {
            //将echart数据格式转换为自定义的
            // this.dragReportData.forEach(row => {
            //     row.children.forEach(col => {
            //         if(col.data.type === "chart") {
            //             col.data.chartData = getMyChartData(col.data.chartData)
            //         }
            //     })
            // })
            let element = document.createElement("a");
            let text = JSON.stringify(this.dragReportData);
            element.setAttribute(
                "href",
                "data:application/json;charset=utf-8," +
                    encodeURIComponent(text)
            );
            element.setAttribute("download", "pageData.json");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
    },

    mounted() {
        this.addListener();
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.$$listeners.scroll);
    },
};
</script>

<style lang="scss" scoped>
.report-container {
    .report-title {
        width: 1000px;
        height: 80px;
        font-size: 3rem;
        .report-title-input {
            width: 500px;
        }
    }

    .report {
        width: 1200px;
        padding-top: 40px;
        .layout-row {
            // margin: 2rem 0;
            .row-controller-bar {
                background-color: #fff;
                color: black;
                justify-content: space-between;
                height: 28px;
                line-height: 28px;
                top: -28px;
                .bar-info-box {
                    max-width: 40%;
                    .bar-layout-info {
                        margin: 0 0.5rem;
                    }
                }
                .bar-btn-box {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    font-size: 18px;
                    .align-type-item {
                        margin: 0 0.5rem;
                    }
                }
            }

            .layout-col-box {
                // border: 1px dashed #cccccc;
                // margin: 0 0.2rem;
                .echartsClass,
                .tableClass {
                    width: 100%;
                    height: 100%;
                    padding-top: 20px;
                }
                .tableClass {
                    overflow: auto;
                }
                .col-controller-bar {
                    height: 20px;
                    line-height: 20px;
                    background-color: transparent;
                    color: black;
                    top: 0;
                    justify-content: space-between;
                    .bar-title-box {
                        margin: 0 0.5rem;
                        max-width: 35%;
                    }
                }
            }
        }
    }

    .drag-report-add-box {
        top: 0;
        height: 800px;
        width: 450px;
        overflow: hidden;
        background-color: white;
        justify-content: flex-start;
        flex-wrap: wrap;
        flex-flow: column;
        box-shadow: 0px 0px 5px #9e9e9e;
        .title-box {
            font-size: 1.8rem;
        }
    }

    .ps-icon-btn {
        transition: top 0.5s;
        font-size: 2.5rem;
        &.add-row-icon {
            left: 10%;
            &:hover {
                animation: transIcon 1s infinite;
            }
        }
        &.add-col-icon {
            right: 10%;
            &:hover {
                animation: transIconReversal 1s infinite;
            }
        }
        &.save-icon {
            right: 5%;
        }
    }
}
</style>
