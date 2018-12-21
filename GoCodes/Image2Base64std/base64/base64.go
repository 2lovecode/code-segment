package main
import (   
    . "github.com/lxn/walk/declarative"
)

import (
	"log"
	"fmt"
	"io/ioutil"
)
import b64 "encoding/base64"
import (
	"github.com/lxn/walk"
)
var base64str = ""
func main() {
	mw := new(MyMainWindow)
	var openAction *walk.Action
	var outTE *walk.TextEdit

	if _, err := (MainWindow{
		AssignTo: &mw.MainWindow,
		Title:    "File2Base64",
		MenuItems: []MenuItem{
			Menu{
				Text: "&File",
				Items: []MenuItem{
					Action{
						AssignTo:    &openAction,
						Text:        "&Open",
						Image:       "../img/open.png",
						OnTriggered: func() {
							mw.openAction_Triggered()
							outTE.SetText(fmt.Sprintf("%+v", base64str))
						},
					},
					Separator{},
					Action{
						Text:        "Exit",
						OnTriggered: func() { mw.Close() },
					},
				},
			},
		},
		Children: []Widget{
			TextEdit{
				AssignTo: &outTE,
				ReadOnly: true,
				Text:     fmt.Sprintf("%+v", base64str),
			},
		},
		MinSize: Size{320, 240},
		Size:    Size{800, 600},
		Layout:  VBox{MarginsZero: true},
	}.Run()); err != nil {
		log.Fatal(err)
	}
}

type MyMainWindow struct {
	*walk.MainWindow
	tabWidget    *walk.TabWidget
	prevFilePath string
}

func (mw *MyMainWindow) openAction_Triggered() {
	if err := mw.openImage(); err != nil {
		log.Print(err)
	}
}

func (mw *MyMainWindow) openImage() error {
	dlg := new(walk.FileDialog)

	dlg.FilePath = mw.prevFilePath
	dlg.Filter = "Image Files (*.emf;*.bmp;*.exif;*.gif;*.jpeg;*.jpg;*.png;*.tiff)|*.emf;*.bmp;*.exif;*.gif;*.jpeg;*.jpg;*.png;*.tiff"
	dlg.Title = "Select an Image"

	if ok, err := dlg.ShowOpen(mw); err != nil {
		return err
	} else if !ok {
		return nil
	}

	mw.prevFilePath = dlg.FilePath
	Fileread(dlg.FilePath, Printt)
	return nil
}

func Fileread(fileName string, handler func(string)) error {
	
	buf, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Println(err)
	}
	uEnc := b64.StdEncoding.EncodeToString(buf)
		
	handler(uEnc)
	return nil
}

func Printt(line string) {
	base64str = line
}