package main

import (
	// b64 "encoding/base64"

	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/widget"
)

func main() {
	a := app.New()
	w := a.NewWindow("Hello World")
	// uEnc := b64.StdEncoding.EncodeToString(buf)
	w.SetContent(widget.NewLabel("Hello World!"))
	w.ShowAndRun()
}
