# 制作与复现步骤

## 1. 视觉与分镜

先阅读 BoardUI 公开展示，提取圆角卡片、周期胶囊、数值标题与悬停聚焦等特点。图表独立绘制，不使用付费组件源码。延续前作的字体与编辑式构图，以饱和橙色开场。五种图表分别解释比较、趋势、占比、维度与密度。

详见 [分镜表](../film/treatment.md)。在 128 BPM 下，一拍 0.46875 秒，32 拍正好 15 秒；画面切点为第 4、9、14、19、23、28 拍。开场与片尾同时摆放五种图表。

## 2. 确定性画面

`film/index.html` 包含原始 Canvas 图表及场景编排；`window.draw(t)` 输入秒数，每个时间点得到固定画面。先加载本地 Noto Sans SC，英文使用 Georgia。逐帧生成时不会依赖实际经过的时间。

## 3. 配乐与音效

`film/make_audio.py` 以固定随机种子生成节拍、旋律、转场音效及淡出，混音后限制峰值。输出 `film/assets/sound.wav`。没有旁白。

## 4. 重新渲染 MP4

需要 Node.js、Python 3、numpy、FFmpeg，以及安装的 Google Chrome。

```sh
cd film
npm install
python3 -m venv .venv
. .venv/bin/activate
pip install numpy
python3 make_audio.py
node render.mjs keys
node render.mjs full
bash encode.sh
```

默认 Chrome 路径为 macOS 的 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`；其他环境先把 `CHROME_PATH` 设为本机 Chrome 的实际路径。Windows 可以在 Git Bash / WSL 中运行脚本，并按运行环境调整浏览器路径。

关键帧在 `previews/`，完整 900 帧在 `frames/`，输出为 `film/charts-motion-15s.mp4`。影片与网站可独立运行。重新生成后，将 MP4 复制到 `media/charts-motion-15s.mp4`，并更新封面、动图和源码 ZIP。

编码脚本显式把 JPEG full range 转为 TV range，输出 H.264 Main、yuv420p、AAC-LC，并添加 faststart，便于浏览器直接播放。

## 5. README 动态预览

仓库根目录执行：

```sh
ffmpeg -y -i media/charts-motion-15s.mp4 -filter_complex "[0:v]fps=10,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3" -loop 0 media/preview.gif
```

GitHub README 使用可点击 GIF 链接到网页视频播放器，完整 MP4 保留声音与 60fps。

## 6. 网页交互

`site/charts.js` 从视频绘制函数适配而来。视频以时间推导自动选中项；网页将选中项改为指针、点按和键盘控制。尺寸仍按原始图表坐标绘制，指针坐标根据画布显示尺寸换算。

- 柱状 / 折线：选择最近的月份或节点。
- 环形：根据角度或图例所在行选择份额，中心数值同步更新。
- 雷达：显示 / 隐藏上期轮廓。
- 热力：把指针位置转换为行列，再使用与影片一致的公式显示次数。

网页使用 requestAnimationFrame 播放进场动画，并遵循 prefers-reduced-motion；它与离线视频的确定性渲染入口分开。没有后端、追踪代码或外部字体请求。

## 7. 本地预览与验收

仓库根目录执行 `python3 -m http.server 8000`，打开 `http://localhost:8000`。检查：

1. 五个标签可切换，图形、标题和操作说明对应。
2. 指针和触屏选中项与提示数值一致；环形四种来源都能选中。
3. 雷达比较开关和动效重播有效。
4. 标签支持左右键 / Home / End；画布支持方向键，雷达支持回车 / 空格。
5. 手机页面无水平溢出，减少动态效果设置生效。
6. MP4 元数据为 15 秒、1920×1080、60fps；可播放及拖动进度。

## 8. GitHub Pages 部署

将仓库文件提交到 `main`。在仓库 Settings → Pages 中选择从分支部署，分支 `main`、目录 `/ (root)`。根目录包含 `.nojekyll`，不需要构建工具。

部署地址：https://jdb156158.github.io/vibe-charts1/ 。仓库所有站内资源均用相对路径，适配 `/vibe-charts1/` 子目录。
