import numpy as np,wave
from pathlib import Path
sr=48000;dur=15;b=60/128;n=int(sr*dur);out=np.zeros((n,2),np.float32);rng=np.random.default_rng(42)
def put(st,x,g=.1,pan=0):
 k=int(st*sr);end=min(n,k+len(x));
 if end<=k:return
 out[k:end,0]+=x[:end-k]*g*(1-pan*.4);out[k:end,1]+=x[:end-k]*g*(1+pan*.4)
def note(f,d=.8):
 t=np.arange(int(sr*d))/sr
 return (np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*2*t)+.1*np.sin(2*np.pi*f*3*t))*np.minimum(1,t*150)*np.exp(-t*5)
for j in range(32):
 st=j*b;t=np.arange(int(sr*.25))/sr
 kick=np.sin(2*np.pi*(52*t+3*(1-np.exp(-t*30))))*np.exp(-t*20)
 put(st,kick,.37 if j%4==0 else .15)
 noise=rng.normal(0,1,len(t));hat=noise*np.exp(-t*130)
 put(st+b/2,hat,.055,(-1)**j*.5)
 if j%2:put(st,noise*np.exp(-t*45),.07)
 chord=[[261.63,329.63,392,493.88],[220,261.63,329.63,392],[174.61,220,261.63,329.63],[196,246.94,293.66,392]][(j//4)%4]
 put(st,note(chord[j%4]*2,.5),.11,(-1)**j*.6)
 if j%4==0:
  for f in chord:put(st,note(f,1.8),.07)
for st in [0,1.875,3.28125,4.21875,5.625,6.5625,7.96875,8.90625,10.78125,12.1875,13.125]:
 t=np.arange(int(sr*.32))/sr;noise=rng.normal(0,1,len(t));smooth=np.convolve(noise,np.ones(30)/30,'same')
 put(max(0,st-.18),smooth*np.sin(np.pi*t/.32)**2,.2)
 put(st,note(880,.3),.1)
fade=np.minimum(1,np.maximum(0,(15-np.arange(n)/sr)/.65));out*=fade[:,None];out=np.tanh(out*1.4)*.85
with wave.open(str(Path(__file__).parent/'assets/sound.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype('<i2').tobytes())
print('15s,128BPM,peak',np.max(abs(out)))
