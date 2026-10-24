# Charts in Motion / 数据统计图 UI

15 秒、1920×1080、60fps、128 BPM，无旁白，短字幕讲解五种统计图 UI：柱状、折线、环形、雷达、热力。

延续上一支卡片影片的编辑式排版，首尾使用饱和橙色 #ef4e24。参考 [BoardUI](https://www.boardui.com/zh-hans) 的公开视觉展示。所有图形及动画独立编写，没有使用 BoardUI Pro 源码。数据为界面演示用的合成数据，非真实业务统计。

## 制作提示词

> 参考 BoardUI 的统计图 UI，用代码制作一支 15 秒知识短片。沿用此前卡片视频的衬线英文大标题、中文短句、纸白与墨黑交替的视觉风格。第一帧必须使用高饱和橙色，有大字和正在变化的图表，避免淡色开场。依次演示柱状渐次生长与聚焦、折线绘制与悬停数值联动、环形展开与占比高亮、雷达轮廓对比、热力网格点亮和热点聚焦。每种效果只讲一个作用。数值标为演示数据，刻度和比例保持正确。以 128 BPM 配乐对齐节奏，交付 MP4 和可复现源码。

## 重新渲染

需要 Node.js、Python + numpy、FFmpeg 和 Google Chrome。

```sh
npm install
python3 -m venv .venv
. .venv/bin/activate
pip install numpy
python3 make_audio.py
node render.mjs keys
node render.mjs full
bash encode.sh
```

`CHROME_PATH` 可覆盖默认 macOS Chrome 路径。关键帧在 previews/；900 张完整帧在 frames/。最终视频为 charts-motion-15s.mp4。

## 制作步骤

1. 阅读 BoardUI 的公开图表展示，提取圆角卡片、周期胶囊、悬停聚焦与联动数值等特点。
2. 写出分镜与拍点：见 treatment.md；32 拍在 128 BPM 下为 15 秒。
3. 在 index.html 中以 Canvas 绘制卡壳和图表；window.draw(t) 只根据时间计算画面，字体就绪才开始渲染。
4. 合成音乐：make_audio.py 使用固定随机种子合成节拍、音符与转场音效。
5. 导出九张关键帧，第一轮调整热力热点与数值单位间距，第二轮强化开场标题与片尾结语。
6. Playwright 逐帧调用 draw(t) 导出 JPEG；FFmpeg 转换色彩范围并编码 Main H.264、yuv420p、AAC-LC，加入 faststart。
7. 从最终 MP4 抽帧，核对时长帧数，并验证浏览器完整播放。

## 文件与授权

- index.html：所有画面、演示数据与时间函数。
- render.mjs：Playwright 渲染器。
- make_audio.py：音乐和音效。
- encode.sh：视频编码。
- treatment.md：参考出处、时间码与数据说明。
- assets/fonts：Noto Sans SC，OFL 授权文件随附。
- vendor：GSAP 和 huashu-motion 运行代码；遵循相应第三方授权。

## 修订：五种图表完整同屏

开场与片尾均同时展示柱状、折线、环形、雷达、热力五种图表，并增加名称与编号。中段保留五种图表的逐项演示，总时长仍为 15 秒。
