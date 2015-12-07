
# NYGulp:利用Gulp 配置的前端静态项目工作流
====

## 功能模块（对应gulp的插件）

### JS 文件合并（gulp-concat）

### JS 文件压缩（gulp-uglify）

### 图片无损压缩1（gulp-imagemin + imagemin-pngquant）

经过实际使用发现，图片压缩略有损失，但基本无碍。

### JS 代替F5神器（browser-sync）

### JS 压缩图片时只压缩新增加的图片（gulp-cache）

跟图片压缩插件配合使用

### JS less编译（gulp-less）

### JS less压缩（gulp-minify-css）

### JS PC雪碧图（gulp-spriter）

目前只使用于PC端的雪碧图 因为H5端图片为实际大小的两倍 还在寻找插件中


## 使用方法


1.  请先确保已经安装Gulp(需要 Node.js 环境) ，建议采用下面的代码全局安装

		$ npm install --global gulp 

2. 进入你的项目文件夹下`clone` 本 git 项目

		$ git clone https://github.com/fromIRIS/NYGulp.git

   `clone` 后建议删除残留的`.git` 缓存文件夹，方便添加自己的Git 版本信息管理：
   
  		$ rm -rf .git  
		
3. 安装相关Node 模块

	在项目文件夹目录下通过下面命令安装相关Node 模块

		npm install 

4. 如果需要进一步的个性化，可以编辑`gulpfile.js` 文件。

		
5. 接下来就可以执行默认任务：

		$ gulp
	
6. 如果项目已经完成，可以通过`build` 命令进行项目相关文件收集，项目文件最终会汇集到项目目录下的`dist` 文件夹中方面进一步操作

		$ gulp build

	如果需要雪碧图，那么命令需改为：

		$ gulp buildspritePc







