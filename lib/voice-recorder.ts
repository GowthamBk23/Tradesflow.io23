export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null

  constructor() {
    this.onDataAvailable = this.onDataAvailable.bind(this)
  }

  public async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(this.stream)
      this.audioChunks = []

      this.mediaRecorder.addEventListener("dataavailable", this.onDataAvailable)
      this.mediaRecorder.start()
    } catch (error) {
      console.error("Error starting recording:", error)
      throw error
    }
  }

  public stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No recording in progress"))
        return
      }

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" })
        this.releaseMediaStream()
        resolve(audioBlob)
      })

      this.mediaRecorder.stop()
    })
  }

  public cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop()
    }
    this.releaseMediaStream()
  }

  public getRecordingDuration(): number {
    if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
      return 0
    }

    return this.mediaRecorder.state === "recording" ? Date.now() - (this.mediaRecorder as any).startTime : 0
  }

  private onDataAvailable(event: BlobEvent): void {
    if (event.data.size > 0) {
      this.audioChunks.push(event.data)
    }
  }

  private releaseMediaStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
    this.mediaRecorder = null
  }
}

export const voiceRecorder = new VoiceRecorder()
