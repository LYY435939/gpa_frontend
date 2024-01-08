<template>
  <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="成绩详情"
      :sub-title="this.activeKey==='1'?'GPA':'排名'"
      @back="back"
  >
    <template #extra>
      <el-button
          size="small" type="success" :icon="Message" circle style="cursor: pointer"
          @click="this.feedback.show=true"/>
      <el-button
          size="small" type="warning" :icon="CalculatorOutlined" circle style="cursor: pointer"
          @click="addCourseShow"/>
      <el-button size="small" type="primary" :icon="SyncOutlined" circle @click="updateAll" style="cursor: pointer;"/>
      <el-button
          size="small" type="danger" :icon="QuestionOutlined" circle style="cursor: help"
          @click="this.visible=true"/>
    </template>
    <a-tabs v-model:activeKey="this.activeKey" @change="handleTabs">
      <a-tab-pane key="1" tab="GPA">
        <a-layout style="height: 80vh;background: rgba(0,0,0,0);">
          <a-layout-header
              style="padding:0 20px 10px 20px;height: 20px;font-size:20px;line-height:20px;background: rgba(0,0,0,0);">
            <div style="text-align: center;font-weight:bold">
                <span style="display:inline-block;width: 20vw;color: #67C23A">
                  {{ totalGrade.toFixed(4) }}
                </span>
              <a-divider type="vertical"/>
              <span style="display:inline-block;width: 20vw;color: #E6A23C">
                  {{ totalGPA.toFixed(4) }}
                </span>
              <a-divider type="vertical"/>
              <span style="display:inline-block;width: 20vw;">
                  {{ totalCredits.toFixed(1) }}
              </span>
            </div>
          </a-layout-header>
          <a-layout-content>
            <a-layout style="height: 80vh;background: rgba(0,0,0,0);">
              <a-layout-header
                  style="padding:10px 6px;height: 14px;font-size:14px;line-height:14px;background: rgba(0,0,0,0);text-align: center;">
                <span style="font-weight:bold">
                  {{ gpa[selSem - 1].name }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <span style="color: #67C23A">
                  {{ semesterScore[selSem - 1].grade.toFixed(4) }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <span style="color: #E6A23C">
                  {{ semesterScore[selSem - 1].gpa.toFixed(4) }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <span>
                  {{ semesterScore[selSem - 1].credits.toFixed(1) }}
                </span>
                <a-divider type="vertical" style="margin: 0 2vw"/>
                <a-switch size="small" v-model:checked="semesterSel[selSem - 1]"
                          @change="changeAllState(selSem-1)"/>
              </a-layout-header>
              <a-layout-content>
                <div style="align-content: center">
                  <template v-for="(sem, i) in gpa">
                    <el-scrollbar v-show="i === selSem - 1" :ref="setScrollRefs" height="65vh"
                                  style="padding-top: 10px">
                      <a-list item-layout="horizontal" size="large"
                              :data-source="sem.courses">
                        <template #renderItem="{ index,item }">
                          <a-list-item
                              :id="'item_'+i+'_'+index"
                              :style="'padding: 8px 12px;'+((item.important===true)?'background-color:#fffb8f;':'')">
                            <template #actions>
                              <EditTwoTone @click="modifyCourse(selSem-1,index)"/>
                              <a-switch size="small" v-model:checked="item.sel"
                                        @change="updateScore"/>
                            </template>
                            <a-list-item-meta>
                              <template #description>
                                <div style="font-size: 14px;line-height: 14px;height:14px;">
                                <span style="display:inline-block;width: 10vw;color: #67C23A">
                                  {{ item.grade }}
                                </span>
                                  <a-divider type="vertical"/>
                                  <span style="display:inline-block;width: 10vw;color: #E6A23C">
                                  {{ item.gpa.toFixed(1) }}
                                </span>
                                  <a-divider type="vertical"/>
                                  <span style="display:inline-block;width: 10vw;">
                                  {{ item.credits.toFixed(1) }}
                                </span>
                                </div>
                              </template>
                              <template #title>
                                {{ item.name }}
                              </template>
                            </a-list-item-meta>
                          </a-list-item>
                        </template>
                      </a-list>
                    </el-scrollbar>
                  </template>
                  <a-pagination style="position:absolute;bottom:0;right:0;padding-top: 10px"
                                size="small" :pageSize="1"
                                v-model:current="this.selSem"
                                :total="this.maxLen" @change="onChange"
                                :show-total="total => `共 ${total} 个学期`"/>
                </div>
              </a-layout-content>
            </a-layout>
          </a-layout-content>
        </a-layout>
      </a-tab-pane>
      <a-tab-pane key="2" tab="排名">
        <a-layout style="height: 80vh;background: rgba(0,0,0,0);">
          <a-layout-header
              style="padding:0 20px 20px 20px;height: 25px;font-size:25px;line-height:25px;background: rgba(0,0,0,0);font-weight:bold">
            <div style="text-align: center;">
              <a-space>
                <span style="font-size: 10vw">{{ this.rank.rank }}</span>
                <span style="font-size: 10vw">{{ '/' }}</span>
                <span style="font-size: 10vw">{{ this.rank.num[5] }}</span>
              </a-space>
            </div>
          </a-layout-header>
          <a-layout-content style="margin-top: 5vh">
            <a-row type="flex" justify="center" align="middle" style="text-align: center">
              <a-col :span="12">
                <el-progress type="circle" :percentage="percentage" :color="colors"/>
              </a-col>
              <a-col :span="12">
                <div>
                  您在全年级前{{ percentage }}%！
                </div>
              </a-col>
            </a-row>
            <a-row type="flex" justify="center" align="middle" style="text-align: center;margin-top: 5vh">
              <a-col :span="8">
                <a-card>
                  <a-statistic
                      title="前一名"
                      :value="this.rank.beforeRankGpa.toFixed(3)"
                      :precision="3"
                      :value-style="{ color: '#3f8600' }"
                  >
                    <template #prefix>
                      <arrow-up-outlined/>
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card style="height: 100%;">
                  <a-statistic
                      title="GPA"
                      :value="this.rank.gpa"
                      :precision="3"
                      :value-style="{ color: '#E6A23C' }"
                  >
                    <template #prefix>
                      <MinusOutlined/>
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              <a-col :span="8">
                <a-card>
                  <a-statistic
                      title="后一名"
                      :value="this.rank.afterRankGpa.toFixed(3)"
                      :precision="3"
                      :value-style="{ color: '#cf1322' }"
                  >
                    <template #prefix>
                      <arrow-down-outlined/>
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              <div ref="rankChart" class="echarts" id="rankChart" style="width: 100%;height: 30vh"></div>
            </a-row>
            <a-row
                type="flex" justify="center" align="middle"
                style="text-align: center;margin-top: 5vh;width: 90vw">
            </a-row>
          </a-layout-content>
        </a-layout>
      </a-tab-pane>
      <template v-if="this.activeKey==='1'" #rightExtra>
        <div style="display:flex;margin-left: auto">
          <a-auto-complete
              id="auto"
              v-show="this.search.show"
              :value="this.search.value"
              :status="this.search.status"
              class="certain-category-search"
              :dropdown-match-select-width="this.width()*0.8"
              style="width: 50vw"
              @clear="searchClear"
              autofocus
              allow-clear
              :options="this.search.options"
              @focus="searchInit"
              @change="searchUpdate"
              @blur="searchBlur"
              @select="searchSelect"
          >
            <template #option="item">
              <template v-if="item.options">
                <strong style="color: #000000;font-size: 4vw">
                  {{ item.value }}
                </strong>
              </template>
              <template v-else>
                <div style="display: flex;justify-content: center;align-items: center;">
                  <div style="display: block;width: 60vw;font-size: 0">
                    <div
                        v-if="item.pos===-1"
                        style="display:inline-block;word-break: break-all;font-size: 14px;white-space: normal">
                      {{ item.name }}
                    </div>
                    <div v-else
                         style="display:inline-block;word-break: break-all;font-size: 14px;white-space: normal">
                      <span>
                        {{ item.name.slice(0, item.pos) }}
                      </span>
                      <span style="background-color: orange">
                        {{ this.search.value }}
                      </span>
                      <span>
                        {{ item.name.slice(item.pos + this.search.value.length) }}
                      </span>
                    </div>
                    <div style="font-size: 14px;line-height: 14px;height:14px;">
                      <span style="display:inline-block;width: 10vw;color: #67C23A">
                        {{ item.grade }}
                      </span>
                      <a-divider type="vertical"/>
                      <span style="display:inline-block;width: 10vw;color: #E6A23C">
                        {{ item.gpa.toFixed(1) }}
                      </span>
                      <a-divider type="vertical"/>
                      <span style="display:inline-block;width: 10vw;">
                        {{ item.credits.toFixed(1) }}
                      </span>
                    </div>
                  </div>
                  <div style="display: inline-block;margin:0 auto">
                    <el-icon color="#409EFC">
                      <Promotion/>
                    </el-icon>
                  </div>
                </div>
              </template>
            </template>
          </a-auto-complete>
          <el-button
              v-show="!this.search.show" :icon="Search" circle
              @click="searchShow"/>
        </div>
      </template>
    </a-tabs>
  </a-page-header>
  <a-modal
      :title="'学分积计算器'"
      :visible="this.add.show"
      width="100%"
      @ok="addClose"
      @cancel="addClose"
      :cancel-button-props="{ style:'visibility:hidden;display:none;' }"
      okText="关闭"
      cancelText="关闭"
      destroyOnClose
      :closable="false"
      :maskClosable="false"
  >
    <a-list size="small" bordered :data-source="this.add.courses"
            :pagination="this.add.pagination">
      <template #footer>
        <a-pagination
            size="small"
            :current="this.add.pagination.current"
            :pageSize="this.add.pagination.pageSize"
            @change="addPaginationChange"
            @showSizeChange="addSizeChange"
            :total="this.add.pagination.total"/>
      </template>
      <template #renderItem="{ index, item }">
        <a-list-item>
          <template #actions>
            <el-tag
                v-if="item.origin===true"
                type="danger"
                size="small"
            >
              原始
            </el-tag>
            <el-tag
                v-else
                type="success"
                size="small"
                closable
                @close="deleteCourse(index)"
            >
              新增
            </el-tag>
          </template>
          <div style="font-size: 16px;line-height: 16px;height:16px;">
              <span style="display:inline-block;width: 30px;color: #67C23A">
                {{ Number(item.grade).toFixed(0) }}
              </span>
            <a-divider type="vertical"/>
            <span style="display:inline-block;width: 25px;color: #E6A23C">
                {{ item.gpa.toFixed(1) }}
              </span>
            <a-divider type="vertical"/>
            <span style="display:inline-block;width: 45px;">
                {{ item.credits.toFixed(1) }}
              </span>
          </div>
        </a-list-item>
      </template>
      <template #header>
        <div style="text-align: center;font-weight:bold;font-size: 4vw">
          <span style="display:inline-block;width: 19vw;color: #67C23A">
            {{ Number(this.add.totalGrade).toFixed(4) }}
          </span>
          <a-divider type="vertical" :orientationMargin="0" style="margin-left: 1vw;margin-right: 1vw;"/>
          <span style="display:inline-block;width: 19vw;color: #E6A23C">
            {{ Number(this.add.totalGPA).toFixed(4) }}
          </span>
          <a-divider type="vertical" :orientationMargin="0" style="margin-left: 1vw;margin-right: 1vw;"/>
          <span style="display:inline-block;width: 19vw;">
            {{ Number(this.add.credits).toFixed(1) }}
          </span>
        </div>
      </template>
      <template #loadMore>
        <div :style="{ textAlign: 'center',lineHeight: '32px' }">
          <el-button round type="success" @click="this.add.showAdd=true" :icon="Plus">添加课程</el-button>
        </div>
      </template>
    </a-list>
    <a-modal
        :title="'增加课程'"
        :visible="this.add.showAdd"
        width="100%"
        @ok="addCourse"
        @cancel="this.add.showAdd=false"
        okText="添加"
        cancelText="取消"
        destroyOnClose
        :closable="false"
        :maskClosable="false"
    >
      <div style="height:160px;margin: 0 auto;position: relative;">
        <el-form
            method="post"
            :model="this.add.addCourse"
            style="position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);">
          <el-form-item label="学分" prop="credits">
            <el-input-number
                v-model="this.add.addCourse.credits"
                size="small"
                :min="0.5"
                :max="10"
                :step="0.5"
                step-strictly
                :precision="1"
                :value-on-clear="0.5"
            />
          </el-form-item>
          <el-form-item label="成绩" prop="grade">
            <el-input-number
                v-model="this.add.addCourse.grade"
                size="small"
                :min="0"
                :max="100"
                :step="1"
                step-strictly
                :value-on-clear="0"
                @change="addUpdateGpaByGrade"
                @blur="addUpdateGpaByGrade"
                @focus="addUpdateGpaByGrade"
            />
          </el-form-item>
          <el-form-item label="绩点" prop="gpa">
            <el-input-number
                v-model="this.add.addCourse.gpa"
                size="small"
                :min="0.0"
                :max="4.1"
                :step="0.1"
                step-strictly
                :precision="1"
                style="color: red"
                readonly :aria-disabled="true" disabled="disabled"/>
          </el-form-item>
        </el-form>
      </div>
    </a-modal>
  </a-modal>
  <a-modal
      v-model:visible="visible" title="帮助"
      :cancel-button-props="{ style:'visibility:hidden;display:none;' }"
      @ok="this.visible=false" @cancel="this.visible=false"
      destroyOnClose
      :closable="false"
      :maskClosable="false"
      ok-text="关闭"
      cancel-text="CANCEL">
    <a-tabs tab-position="bottom" :size="'small'" v-model:activeKey="this.helpKey">
      <a-tab-pane key="1" tab="基本功能">
        <el-scrollbar max-height="40vh" height="40vh">
          <div>
            <p>
              1.“瓜大学分积2”主界面分为两个板块：<strong>GPA查询与排名查询</strong>；
            </p>
            <p>
              2.在GPA查询板块中，所有<strong style="color:#67C23A;">绿色</strong>部分代表课程的百分成绩，所有<strong
                style="color:#E6A23C;">黄色</strong>部分代表课程的学分，所有<strong>灰色</strong>部分代表课程的绩点；
            </p>
            <p>
              3.您可通过点击
              <a-switch size="small" v-model:checked="helpButton"/>
              手动打开/关闭一些课程的成绩，查看总成绩的变化。当然，您可以通过点击学期处的开关来打开/关闭整个学期的成绩（默认打开/关闭的课程和成绩计算规则详见<strong><a
                @click="this.helpKey='4'">“帮助→成绩查询说明”</a></strong>）；
            </p>
            <p>
              4.您可通过点击
              <el-button :icon="Search" circle/>
              唤起检索框，搜索您找不到的某门课程。相关课程会高亮标出，您可点击栏目或点击
              <el-icon color="#409EFC">
                <Promotion/>
              </el-icon>
              自动跳转到相关课程处；
            </p>
            <p>
              5.您还可以通过点击
              <EditTwoTone/>
              修改相关课程的成绩，详见<strong><a
                @click="this.helpKey='2'">“帮助→修改成绩”</a></strong>；
            </p>
            <p>
              6.右上角四个按钮的功能：
            </p>
            <p style="text-indent: 2em;">
              (1)
              <el-button
                  size="small" type="success" :icon="Message" circle style="cursor: pointer"
                  @click="this.feedback.show=true"/>
              为收集反馈信息的功能，您可在此写下您的留言与对软件的评分；
            </p>
            <p style="text-indent: 2em;">
              (2)
              <el-button
                  size="small" type="warning" :icon="CalculatorOutlined" circle style="cursor: pointer"
                  @click="addCourseShow"/>
              为学分积计算器，可以手动增加课程，详见<strong><a
                @click="this.helpKey='3'">“帮助→学分积计算器”</a></strong>；
            </p>
            <p style="text-indent: 2em;">
              (3)
              <el-button
                  size="small" type="primary" :icon="SyncOutlined" circle @click="updateAll"
                  style="cursor: pointer;"/>
              为刷新页面的功能，在您认为您的成绩单有新增加的课程，您可点击这个按钮进行刷新。<strong>注意：为了避免给服务器带来较大压力，您在每次访问之后必须等待一个随机退避时间（15~25分钟），才可以进行下次访问</strong>；
            </p>
            <p style="text-indent: 2em;">
              (4)
              <el-button
                  size="small" type="danger" :icon="QuestionOutlined" circle style="cursor: help"
                  @click="this.visible=true"/>
              为帮助按钮，可以打开帮助页面；
            </p>
            <p>
              7.若您还有其它事宜，请与我们联系。
            </p>
            <p style="text-align: center">
              QQ: 2327706652 QQ群: 759715594
            </p>
          </div>
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="'修改成绩'">
        <el-scrollbar max-height="40vh" height="40vh">
          <div>
            <p>
              世上没有“后悔药”！但是人们总希望从过往的经历中总结经验，以在未来取得更好的成绩。
            </p>
            <p>
              “瓜大学分积2”推出了一款修改成绩的功能，如果当时某门课程考了xxx分，那么总成绩会如何呢？您可通过点击
              <EditTwoTone/>
              修改相关课程的成绩
            </p>
            <p>
              希望各位都能取得好成绩！
            </p>
          </div>
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="3" :tab="'学分积计算器'">
        <el-scrollbar max-height="40vh" height="40vh">
          <div>
            <p>
              1.点击
              <el-button
                  size="small" type="warning" :icon="CalculatorOutlined" circle style="cursor: pointer"
                  @click="addCourseShow"/>
              即可打开学分积计算器功能面板；
            </p>
            <p>
              2.标注
              <el-tag type="danger" size="small">
                原始
              </el-tag>
              为您在主页面得到的总学分积，不可关闭；标注为
              <el-tag type="success" size="small" closable>
                新增
              </el-tag>
              是您新增的课程，您可点击“×”将其关闭；
            </p>
            <p>
              3.您可点击
              <el-button round type="success" :icon="Plus">添加课程</el-button>
              来新增课程和使用分页
              <a-pagination style="display: inline-block" size="small" :total="50"/>
              功能。
            </p>
          </div>
        </el-scrollbar>
      </a-tab-pane>
      <a-tab-pane key="4" tab="成绩查询说明">
        <el-scrollbar max-height="40vh" height="40vh">
          <div>
            <p>
              1.优秀/A：90 良好/B：80 中等/C：70 及格/D：60 P：60 其它以0计；
            </p>
            <p>
              2.P的课程GPA以1.0计，百分成绩按照60计；
            </p>
            <p>
              3.翱翔门户百分成绩未按学分加权，iNWPU加权；
            </p>
            <p>
              4.翱翔门户GPA默认包含所有非1.0课程绩点，iNWPU中可自行打开；
            </p>
            <p>
              5.排名未包含并列情况，例如：90、90，89，则排名显示时89为第二名，真实排名数值约有10%的上浮；
            </p>
            <p>
              6.其它一切情况以翱翔门户教务系统为准。
            </p>
          </div>
        </el-scrollbar>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
  <a-modal
      :title="'输入发送至 '+this.securePhone+' 的验证码'"
      :visible="this.showCode"
      width="100%"
      @ok="this.verify"
      @cancel="this.showCode=false"
      okText="确定"
      cancelText="取消"
      destroyOnClose
      :closable="false"
      :maskClosable="false"
      :confirmLoading="this.code.load"
  >
    <el-form
        ref="code"
        method="post"
        :model="code"
        :rules="codeRule"
        style="position: relative">
      <el-form-item label="验证码" prop="code">
        <el-input
            v-model="code.code"
            type=""
            placeholder="请输入验证码"
            autocomplete="on"/>
      </el-form-item>
    </el-form>
  </a-modal>
  <a-modal
      :title="'修改 '+this.modify.name+' 课程的成绩'"
      :visible="this.modify.show"
      width="100%"
      @ok="modifyAndUpdate"
      @cancel="modifyRollBack"
      okText="确定"
      cancelText="还原"
      destroyOnClose
      :closable="false"
      :maskClosable="false"
  >
    <div style="height:160px;margin: 0 auto;position: relative;">
      <el-form
          method="post"
          :model="this.modify"
          style="position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);">
        <el-form-item label="学分" prop="credits">
          <el-input-number
              v-model="this.modify.credits"
              size="small"
              :min="0.5"
              :max="10"
              :step="0.5"
              step-strictly
              :precision="1"
              :value-on-clear="this.modify.course.credits"
          />
        </el-form-item>
        <el-form-item label="成绩" prop="grade">
          <el-input-number
              v-model="this.modify.grade"
              size="small"
              :min="0"
              :max="100"
              :step="1"
              step-strictly
              :value-on-clear="Number(this.modify.course.grade)"
              @change="updateGpaByGrade"
              @blur="updateGpaByGrade"
              @focus="updateGpaByGrade"
          />
        </el-form-item>
        <el-form-item label="绩点" prop="gpa">
          <el-input-number
              v-model="this.modify.gpa"
              size="small"
              :min="0.0"
              :max="4.1"
              :step="0.1"
              step-strictly
              :precision="1"
              style="color: red"
              readonly :aria-disabled="true" disabled="disabled"/>
        </el-form-item>
      </el-form>
    </div>
  </a-modal>
  <a-modal
      :title="'使用反馈'"
      :visible="this.feedback.show"
      width="100%"
      @ok="sendFeedback"
      @cancel="this.feedback.show=false"
      okText="发送"
      cancelText="取消"
      destroyOnClose
      :closable="false"
      :maskClosable="false"
      :confirmLoading="this.feedback.load"
  >
    <div>
      <p>
        欢迎各位在使用中有任何问题在此留言，有志同道合的小伙伴想为“瓜大学分积2”贡献力量的，也欢迎与我们取得联系！
      </p>
      <p>
        QQ: 2327706652
      </p>
      <p>
        QQ群: 759715594
      </p>
    </div>
    <a-row>
      <a-col :span="24">
        <a-textarea
            v-model:value="this.feedback.message"
            show-count :maxlength="500"
            placeholder="请在此留下您的宝贵意见或建议，该反馈完全匿名，您的个人隐私不会被发送。您的支持是我们前进最大的动力！"
            :auto-size="{ minRows: 5, maxRows: 5 }"
        />
      </a-col>

    </a-row>

    <a-row type="flex">
      <a-col :span="5">

      </a-col>
      <a-col style="display: flex" :span="14">
        <a-rate v-model:value="this.feedback.rate" style="margin: auto" @focus="" :allow-clear="false"
                @blur="updateRate" @change="updateRate">
          <template #character>
            <heart-filled/>
          </template>
        </a-rate>
      </a-col>
      <a-col :span="5" style="display: flex">
        <div :style="'font-family: KaiTi;font-size: 4vw;margin: auto;color:'+this.feedback.color">
          <strong>
            {{ this.feedback.rateStr }}
          </strong>
        </div>
      </a-col>
    </a-row>

  </a-modal>
  <a-modal
      :title="'恢复维护通知'"
      :visible="this.update"
      width="80%"
      @ok="this.update=false;this.visible=true;"
      @cancel="this.update=false;"
      okText="打开帮助"
      cancelText="关闭"
      destroyOnClose
      :closable="false"
      :maskClosable="false"
  >
    <p>
      感谢朋友们的支持，使得瓜大学分“瓜大学分积2”可以重新运行，需要注意的是服务器更换为西工大内网服务器，<strong>若出现无法访问的情况，需要使用校内VPN。</strong>
    </p>
    <!--    <p>-->
    <!--      “瓜大学分积2”将于<strong>2024/01/19 12:37:51</strong>-->
    <!--      停止运行、维护以及任何更新。项目运行迄今已经超过一年时间，由于服务器到期，项目近2万行的代码也终于要和大家说再见了。-->
    <!--      感谢大家一直以来对“瓜大学分积2”的喜爱与支持。</p>-->
    <!--    <p>-->
    <!--      项目反馈功能启动以来，收到了近百条的全5分好评，和一些bug反馈。在此感谢大家对“瓜大学分积2”不断更新做出的帮助。-->
    <!--      “瓜大学分积2”的进步离不开每一名NPUer的支持。-->
    <!--    </p>-->
    <p>
      由于使用了新版组件库，对于手机端UI显示出现问题的同学，可以尝试使用网页端访问，请将地址拷贝到浏览器中进行访问
      https://www.study-npuer.com/gpa
    </p>
    <p>
      <strong>
        最后，再次感谢大家对于“瓜大学分积2”的支持！
      </strong>
    </p>
  </a-modal>

</template>

<script>
import {CaretTop, Message, Plus, QuestionFilled, Search, Promotion} from '@element-plus/icons-vue'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalculatorOutlined,
  DownloadOutlined,
  EditTwoTone,
  HeartFilled,
  MinusOutlined,
  PlusOutlined,
  QuestionCircleTwoTone,
  QuestionOutlined,
  SyncOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import {ref} from "vue";
import * as echarts from "echarts"
import api from "@/api";

export default {
  name: "MainView",
  components: {
    QuestionFilled,
    QuestionCircleTwoTone,
    ArrowUpOutlined,
    CaretTop,
    MinusOutlined,
    ArrowDownOutlined,
    QuestionOutlined,
    DownloadOutlined,
    SyncOutlined,
    Message,
    EditTwoTone,
    CalculatorOutlined,
    HeartFilled,
    PlusOutlined,
    Plus,
    Search,
    SearchOutlined,
    Promotion
  },
  data() {
    return {
      Message: Message,
      QuestionOutlined: QuestionOutlined,
      SyncOutlined: SyncOutlined,
      CalculatorOutlined: CalculatorOutlined,
      Search: Search,
      helpButton: true,
      Plus: Plus,
      codeRule: {
        code: [{
          required: true,
          pattern: /^\d{4}$/,
          message: "验证码位数不正确",
          trigger: ['blur', 'change']
        }],
      },
      load: "no_load",
      loading: false,
      code: {
        code: "",
        load: false,
      },
      securePhone: "",
      showCode: false,
      selSem: ref(1),
      key: 0,
      scrollbarRefs: [],
      maxLen: 1,
      visible: false,
      update: true,
      QuestionFilled: QuestionFilled,
      QuestionCircleTwoTone: QuestionCircleTwoTone,
      activeKey: '1',
      helpKey: '1',
      totalGPA: 0.0,
      totalGrade: 0.0,
      totalCredits: 0.0,
      allGPA: 0.0,
      allGrade: 0.0,
      allCredits: 0.0,
      gpa: [],
      semesterSel: [],
      semesterScore: [],
      rank: {
        afterRankGpa: 0.000,
        avgMajorGpa: 0.000,
        beforeRankGpa: 0.000,
        gpa: 0.000,
        num: [
          0, 0, 0, 0, 0, 0
        ],
        rank: 0,
        studentAssoc: 0
      },
      percentage: 0,
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100},
      ],
      position: 1,
      left: 0,
      option: {
        title: [
          {
            show: true,
            text: "您在年级中的位置",
            textStyle: {
              fontWeight: "normal",
              fontSize: "14",
            },
            x: "center",
            y: "top",
            textAlign: "left",
          },
          {
            show: true,
            text: "↓",
            textStyle: {
              fontWeight: 'bolder',
              fontSize: "20",
              color: "#FF0000"
              // left: "center",
            },
            left: "0px",
            top: '5%',
            textAlign: "center",
          },
        ],
        xAxis: {
          boundaryGap: false,
          barWidth: '100%',
          data: ["[100, 90]", "(90, 80]", "(80, 70]", "(70, 60]", "(60, 0]"],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
        },
        yAxis: {
          boundaryGap: false,
          show: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: "bar",
            data: [],
            barWidth: "100%",
            itemStyle: {
              barBorderRadius: 0,
              borderWidth: 0,
              borderType: "solid",
              borderColor: "#73c0de",
              shadowColor: "#73c0de",
              shadowBlur: 3,
            },
            label: {
              normal: {
                position: 'top',
                color: '#000000',
                show: true,
              }
            },
          }
        ]
      },
      modify: {
        show: false,
        course: {
          name: "",
          credits: 0,
          grade: 0,
          gpa: 0,
        },
        sem: 0,
        id: 0,
        name: "",
        credits: 0,
        grade: 0,
        gpa: 0,
      },
      feedback: {
        load: false,
        show: false,
        message: "",
        rate: 5,
        rateStr: "非常好",
        color: "#FF0000",
        colorList: [
          "#FF0000",
          "#fff200",
          "#00ff00",
          "#890ae7",
          "#de0bde",
          "#000000",
        ],
        rateList: [
          "非常好",
          "好",
          "一般",
          "差",
          "非常差",
          "未评分",
        ]
      },
      add: {
        show: false,
        showAdd: false,
        courses: [],
        allGPA: 0.0,
        allGrade: 0.0,
        totalGPA: 0.0,
        totalGrade: 0.0,
        credits: 0.0,
        addCourse: {
          gpa: 0.0,
          grade: 0.0,
          credits: 0.5,
        },
        pagination: {
          position: 'bottom',
          current: ref(1),
          pageSize: 5,
          showQuickJumper: true,
          total: 1,
        }
      },
      search: {
        i: -1,
        j: -1,
        value: "",
        show: false,
        options: [],
        status: "",
      },
    }
  },
  created() {
    this.init();
  },
  mounted() {
    setTimeout(() => {
      this.initEcharts()
    }, 5000);
  },
  methods: {
    width() {
      return window.screen.availWidth;
    },
    init() {
      let data = JSON.parse(localStorage.getItem("gpa"))
      this.gpa = data.gpa;
      this.maxLen = this.gpa.length;
      console.log(this.maxLen)
      this.rank = data.rank;
      this.gpa.forEach(function (s) {
        s.courses.forEach(function (c) {
          let g = c.grade.toString();
          let reg1 = new RegExp("[\\u4E00-\\u9FFF]+", "g");
          let reg2 = new RegExp("[A-Za-z\\-]+", "g");
          let r1 = reg1.test(g);
          let r2 = reg2.test(g);
          c.sel = (!r1) && (!r2);
          if (c.gpa === null)
            c.gpa = 0.0;
          if (c.sel === true) {
            c.actualGrade = parseFloat(c.grade);
          } else {
            if (r2) {
              if (g.search("A") !== -1) {
                c.actualGrade = 90.0;
              } else if (g.search("B") !== -1) {
                c.actualGrade = 80.0;
              } else if (g.search("C") !== -1) {
                c.actualGrade = 70.0;
              } else if (g.search("D") !== -1) {
                c.actualGrade = 60.0;
              } else if (g.search("P") !== -1) {
                c.actualGrade = 60.0;
                c.gpa = 1.0;
              } else {
                c.actualGrade = 0.0;
              }
            } else {
              if (g.search("优") !== -1) {
                c.actualGrade = 90.0;
              } else if (g.search("良") !== -1) {
                c.actualGrade = 80.0;
              } else if (g.search("中") !== -1) {
                c.actualGrade = 70.0;
              } else if (g.search("及格") !== -1) {
                c.actualGrade = 60.0;
              } else {
                c.actualGrade = 0.0;
              }
            }
          }
        })
      });
      console.log(this.gpa);
      console.log(this.rank);
      for (let s of this.gpa) {
        let flag = true;
        for (let c of s.courses) {
          if (c.sel) {
            this.semesterSel.push(true);
            flag = false;
            break;
          }
        }
        if (flag) {
          this.semesterSel.push(false);
        }
      }
      for (let i = 0; i < this.gpa.length; i++) {
        this.semesterScore.push({
          grade: 0.0,
          gpa: 0.0,
          credits: 0.0
        });
      }
      this.updateScore();
      this.updateRank();
      this.option.series[0].data = this.rank.num;
      let tmp = this.rank.rank;
      for (let i = 0; i < this.rank.num.length; i++) {
        tmp -= this.rank.num[i];
        if (tmp <= 0) {
          this.left = this.rank.num[i] + tmp;
          this.position = i;
          break;
        }
      }
      let val = this.option.series[0].data[this.position];
      this.option.series[0].data[this.position] = {
        value: val,
        itemStyle: {
          color: "pink",
        }
      }
    },
    handleTabs() {
      if (this.activeKey === '2') {
        setTimeout(() => {
          this.initEcharts()
        }, 50);
      }
    },
    setPercent() {
      const cn = document.getElementsByTagName("canvas")[0];
    },
    initEcharts() {
      const chartDom = document.getElementById('rankChart');
      let w = Number(window.getComputedStyle(chartDom).width.replace("px", ""));
      let minP = 10, maxP = w - 10 - 1;
      let percent = this.position * 20 + this.left / Number(this.rank.num[this.position].value) * 20;
      let goal = percent * w / 100;
      goal = Math.max(minP, goal);
      goal = Math.min(maxP, goal);
      this.option.title[1].left = goal.toFixed(2) + "px";

      const rankChart = echarts.init(chartDom);
      rankChart.setOption(this.option);
      window.addEventListener("resize", () => {
        rankChart.resize();
      });
    },
    onChange(pageNumber) {
      console.log('Page: ', pageNumber);
    },
    changeAllState(id) {
      let goal = this.semesterSel[id];
      this.gpa[id].courses.forEach((c) => {
        c.sel = goal;
      });
      this.updateScore();
    },
    updateRank() {
      this.percentage = Number((100 * this.rank.rank / this.rank.num[5]).toFixed(0));
    },
    updateScore() {
      let allGPA = 0.0, allGrade = 0.0, allCredits = 0.0;
      for (let i = 0; i < this.gpa.length; i++) {
        let sGPA = 0.0, sGrade = 0.0, sCredits = 0.0;
        for (let j = 0; j < this.gpa[i].courses.length; j++) {
          if (this.gpa[i].courses[j].sel) {
            sGPA += this.gpa[i].courses[j].gpa * this.gpa[i].courses[j].credits;
            sGrade += this.gpa[i].courses[j].actualGrade * this.gpa[i].courses[j].credits;
            sCredits += this.gpa[i].courses[j].credits;
          }
        }
        allGPA += sGPA;
        allGrade += sGrade;
        allCredits += sCredits;
        this.semesterScore[i] = {
          grade: sGrade / sCredits,
          gpa: sGPA / sCredits,
          credits: sCredits
        }
      }
      this.totalGPA = allGPA / allCredits;
      this.totalGrade = allGrade / allCredits;
      this.totalCredits = allCredits;
      this.allGPA = allGPA;
      this.allGrade = allGrade;
      this.allCredits = allCredits;
    },
    back() {
      localStorage.removeItem("gpa");
      this.$router.go(-1);
    },
    updateAll() {
      let k = localStorage.getItem("key");
      if (k === null) {
        this.$message.error("缓存过期，请重新登录");
        this.back();
      }
      k = JSON.parse(k);
      this.$message.info("请求中，请等待");
      api.loginMFA({
        username: k.username,
        password: k.password,
      }).then((response) => {
        if (response.data.success) {
          this.$message.success(response.data.message);
          localStorage.setItem("gpa", JSON.stringify(response.data.data));
          this.init();
        } else {
          if (response.data.code === 304) {
            this.$message.warning(response.data.message);
            this.securePhone = response.data.data.securePhone;
            this.showCode = true;
          } else {
            this.$message.error(response.data.message);
          }
        }
      }).catch((error) => {
        this.$message.error(error.toString());
      })
    },
    Grade2Gpa(grade) {
      let gpa = 0.0;
      if (grade >= 95) {
        gpa = 4.1;
      } else if (grade >= 90) {
        gpa = 3.9;
      } else if (grade >= 85) {
        gpa = 3.7;
      } else if (grade >= 81) {
        gpa = 3.3;
      } else if (grade >= 78) {
        gpa = 3.0;
      } else if (grade >= 75) {
        gpa = 2.7;
      } else if (grade >= 72) {
        gpa = 2.3;
      } else if (grade >= 68) {
        gpa = 2.0;
      } else if (grade >= 64) {
        gpa = 1.7;
      } else if (grade >= 60) {
        gpa = 1.3;
      } else {
        gpa = 0.0;
      }
      return gpa;
    },
    updateGpaByGrade() {
      let grade = this.modify.grade;
      this.modify.gpa = this.Grade2Gpa(grade);
    },
    modifyCourse(sem, id) {
      this.modify.name = this.gpa[sem].courses[id].name;
      this.modify.grade = Number(this.gpa[sem].courses[id].grade);
      this.modify.credits = this.gpa[sem].courses[id].credits;
      this.modify.gpa = this.gpa[sem].courses[id].gpa;
      this.modify.course = this.gpa[sem].courses[id];
      this.modify.sem = sem;
      this.modify.id = id;
      let origin_gpa = this.modify.course.gpa;
      let origin_grade = this.modify.course.grade;
      let origin_credits = this.modify.course.credits;
      if (localStorage.getItem("item_" + sem + "_" + id + "_origin") == null)
        localStorage.setItem("item_" + sem + "_" + id + "_origin", JSON.stringify({
          gpa: origin_gpa,
          grade: origin_grade,
          credits: origin_credits,
        }));
      this.modify.show = true;
    },
    modifyAndUpdate() {
      let sem = this.modify.sem;
      let id = this.modify.id;

      this.gpa[sem].courses[id].credits = this.modify.credits;
      this.gpa[sem].courses[id].gpa = this.modify.gpa;
      this.gpa[sem].courses[id].grade = String(this.modify.grade);
      this.gpa[sem].courses[id].important = true;
      this.updateScore();
      this.modify.show = false;
    },
    modifyRollBack() {
      let sem = this.modify.sem;
      let id = this.modify.id;
      let origin = JSON.parse(localStorage.getItem("item_" + sem + "_" + id + "_origin"));

      this.gpa[sem].courses[id].credits = origin.credits;
      this.gpa[sem].courses[id].gpa = origin.gpa;
      this.gpa[sem].courses[id].grade = String(origin.grade);
      localStorage.removeItem("item_" + sem + "_" + id + "_origin");
      this.gpa[sem].courses[id].important = false;
      this.updateScore();
      this.modify.show = false;
    },
    updateRate() {
      let rate = this.feedback.rate;
      this.feedback.color = this.feedback.colorList[5 - rate];
      this.feedback.rateStr = this.feedback.rateList[5 - rate];
    },
    sendFeedback() {
      this.feedback.load = true;
      api.feedback({
        rate: this.feedback.rate,
        message: this.feedback.message,
      }).then((response) => {
        if (response.data.success) {
          this.$message.success(response.data.message);
        } else {
          this.$message.error(response.data.message);
        }
      }).catch((error) => {
        this.$message.error(error.toString());
      }).finally(() => {
        this.feedback.load = false;
        this.feedback.show = false;
      })
    },
    addUpdateGpaByGrade() {
      let grade = this.add.addCourse.grade;
      this.add.addCourse.gpa = this.Grade2Gpa(grade);
    },
    addCourseShow() {
      this.add.allGPA = this.allGPA;
      this.add.allGrade = this.allGrade;
      this.add.totalGPA = this.totalGPA;
      this.add.totalGrade = this.totalGrade;
      this.add.credits = this.allCredits;
      if (this.add.courses.length === 0)
        this.add.courses.push({
          gpa: this.add.totalGPA,
          grade: this.add.totalGrade,
          credits: this.add.credits,
          origin: true
        });
      this.add.show = true;
    },
    addCourse() {
      this.add.courses.push({
        gpa: this.add.addCourse.gpa,
        grade: this.add.addCourse.grade,
        credits: this.add.addCourse.credits,
      });
      this.addUpdate();
      this.add.pagination.total = this.add.courses.length;
      this.add.pagination.current = Math.ceil(this.add.pagination.total / this.add.pagination.pageSize)
      this.add.showAdd = false;
    },
    deleteCourse(index) {
      index = index + this.add.pagination.pageSize * (this.add.pagination.current - 1);
      console.log(index)
      this.add.courses.splice(index, 1);
      this.add.pagination.total = this.add.courses.length;
      this.add.pagination.current = Math.ceil(this.add.pagination.total / this.add.pagination.pageSize)
      this.addUpdate();
    },
    addUpdate() {
      this.add.allGPA = 0.0;
      this.add.allGrade = 0.0;
      this.add.credits = 0.0;
      for (let i = 0; i < this.add.courses.length; i++) {
        this.add.allGPA += this.add.courses[i].credits * this.add.courses[i].gpa;
        this.add.allGrade += this.add.courses[i].credits * this.add.courses[i].grade;
        this.add.credits += this.add.courses[i].credits;
      }
      this.add.totalGPA = this.add.allGPA / this.add.credits;
      this.add.totalGrade = this.add.allGrade / this.add.credits;
    },
    addClose() {
      this.add.showAdd = false;
      this.add.courses = [];
      this.add.show = false;
    },
    addPaginationChange(page) {
      console.log(page)
      this.add.pagination.current = page;
    },
    addSizeChange(current) {
      console.log(current)
    },
    verify() {
      this.$refs["code"].validate((valid) => {
        if (valid) {
          this.$message.info("请求中，请等待");
          this.code.load = true;
          api.verify({
            code: this.code.code,
          }).then((response) => {
            if (response.data.success) {
              this.$message.success(response.data.message);
              localStorage.setItem("gpa", JSON.stringify(response.data.data));
              this.code.load = false;
              this.showCode = false;
              this.init();
            } else {
              this.$message.error(response.data.message);
              this.code.load = false;
              this.showCode = false;
            }
          }).catch((error) => {
            this.$message.error(error.toString());
            this.code.load = false;
            this.showCode = false;
          })
        }
      })
    },
    searchShow() {
      this.search.show = true;
      document.getElementById('auto').focus();
    },
    searchInit() {
      console.log("init")
      if (this.search.value !== '')
        this.searchUpdate(this.search.value);
      else {
        let searchCourses = [];
        for (let i = 0; i < this.gpa.length; i++) {
          let semester = {
            name: this.gpa[i].name,
            value: this.gpa[i].name,
            label: this.gpa[i].name,
            id: this.gpa[i].id,
            page: i + 1,
            options: [],
          }
          for (let j = 0; j < this.gpa[i].courses.length; j++) {
            semester.options.push({
              i: i,
              j: j,
              pos: -1,
              name: this.gpa[i].courses[j].name,
              value: this.gpa[i].courses[j].name,
              label: this.gpa[i].courses[j].name,
              credits: this.gpa[i].courses[j].credits,
              gpa: this.gpa[i].courses[j].gpa,
              grade: this.gpa[i].courses[j].grade,
            })
          }
          searchCourses.push(semester)
        }
        this.search.options = searchCourses;
        console.log(this.search.options)
      }
    },
    searchUpdate(value) {
      this.search.value = value;
      console.log(value)
      let searchCourses = [];
      for (let i = 0; i < this.gpa.length; i++) {
        let semester = {
          value: this.gpa[i].name,
          label: this.gpa[i].name,
          name: this.gpa[i].name,
          id: this.gpa[i].name,
          page: i + 1,
          options: [],
          sem: true,
        }
        for (let j = 0; j < this.gpa[i].courses.length; j++) {
          let pos = this.gpa[i].courses[j].name.indexOf(value);
          if (pos !== -1)
            semester.options.push({
              i: i,
              j: j,
              pos: (value === '') ? -1 : pos,
              name: this.gpa[i].courses[j].name,
              label: this.gpa[i].courses[j].name,
              value: this.gpa[i].courses[j].name,
              credits: this.gpa[i].courses[j].credits,
              gpa: this.gpa[i].courses[j].gpa,
              grade: this.gpa[i].courses[j].grade,
            })
        }
        if (semester.options.length !== 0)
          searchCourses.push(semester)
      }
      this.search.options = searchCourses;
      if (this.search.options.length === 0)
        this.search.status = "error";
      else
        this.search.status = "";
    },
    setScrollRefs(bar) {
      this.scrollbarRefs.push(bar);
    },
    searchSelect(value, option) {
      console.log("select:" + value);
      if (this.search.i !== -1 && this.search.j !== -1)
        this.gpa[this.search.i].courses[this.search.j].important = false;
      this.search.value = value;
      this.search.i = option.i;
      this.search.j = option.j;
      this.gpa[this.search.i].courses[this.search.j].important = true;
      this.selSem = this.search.i + 1;
      setTimeout(this.searchRollAsync, 100);
    },
    searchRollAsync() {
      let height = 0;
      for (let k = 0; k < this.search.j; k++) {
        height += document.getElementById('item_' + this.search.i + '_' + k).offsetHeight;
      }
      this.scrollbarRefs[this.search.i].setScrollTop(height);
      this.scrollbarRefs[this.search.i].update();
    },
    searchBlur() {
      if (this.search.value === '')
        this.searchClear();
    },
    searchClear() {
      if (this.search.i !== -1 && this.search.j !== -1)
        this.gpa[this.search.i].courses[this.search.j].important = false;
      this.search = {
        i: -1,
        j: -1,
        value: "",
        show: false,
        options: [],
        status: "",
      };
    },
    sleep(time) {
      var timeStamp = new Date().getTime();
      var endTime = timeStamp + time;
      while (true) {
        if (new Date().getTime() > endTime) {
          return;
        }
      }
    },
  }
}
</script>

<style scoped>

.el-menu-vertical-demo {
  position: absolute;
  top: 0;
  bottom: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {
  color: #666;
  font-weight: bold;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item-group {
  border-bottom: 1px solid #f6f6f6;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item {
  padding-left: 16px;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item.show-all {
  text-align: center;
  cursor: default;
}

.certain-category-search-dropdown .ant-select-dropdown-menu {
  max-height: 300px;
}
</style>
