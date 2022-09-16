<!--
 * @Description: 根据配置文件生成页面
 -->
<template>
    <div id="createPage">
        <!-- 行 -->
        <div class="row"
             v-for="(item,index) in pageData"
             :key="index + 1"
             :style="setRowStyle(item)">

            <!-- 列 -->
            <div class="col"
                 v-for="(i,num) in item.children"
                 :key="num + '1'"
                 :style="setColStyle(i)">
                <div class="chart"
                     :id="i.data.id"
                     v-if="i.data.type === 'chart'">
                </div>

                <div class="table"
                     v-show="i.data.type === 'table'">
                    <el-table :data="i.data.tableBody"
                              style="width: 100%"
                              :cell-style="() => setCellStyle(i.data)"
                              :header-cell-style="() => setHeadCellStyle(i.data)"
                              size="small">
                        <template v-for="o in i.data.tableHead">
                            <el-table-column :prop="o.prop"
                                             :label="o.label"
                                             :key="o.label"></el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
// import { getEchartData } from "@/static/getEchartData.js";
export default {
    data() {
        return {
            pageData: {},
        };
    },
    methods: {
        setRowStyle(row) {
            let rowStyle = {
                width: "100%",
                height: row.initHeight + "px",
                margin: row.margin,
                display: row.display,
                justifyContent: row.justifyContent,
            };
            return rowStyle;
        },
        setColStyle(col) {
            let colStyle = {
                height: "100%",
                border: col.border,
                margin: col.margin,
                borderRadius: col.borderRadius,
                width: parseInt((col.initCol * 100) / 24) + "%",
            };
            return colStyle;
        },
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
    },
    created() {
        axios.get("http://localhost:8080/pageData.json").then((res) => {
            this.pageData = res.data;
            console.log(res.data);
            this.pageData.forEach((item) => {
                item.children.forEach((ele) => {
                    if (ele.data.type === "chart") {
                        // let echartData = getEchartData(ele.data.chartData);
                        this.$nextTick(() => {
                            let myChart = this.$echarts.init(
                                document.getElementById(ele.data.id)
                            );
                            myChart.setOption(ele.data.chartData);
                        });
                    }
                });
            });
        });
    },
    mounted() {},
};
</script>

<style lang="scss">
#createPage {
    width: 1200px;
    margin: 0 auto;
    .chart {
        width: 100%;
        height: 100%;
    }
    .table {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
}
</style>