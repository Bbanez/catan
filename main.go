package main

import (
	"embed"

	appstate "github.com/bbanez/catan/src/app_state"
	settings_api "github.com/bbanez/catan/src/settings/api"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
//go:embed all:assets
var assets embed.FS

func main() {
	appstate.Init()
	app := NewApp()
	settingsApi := settings_api.New()
	iconMac, err := assets.ReadFile("assets/icons/icon.icns")
	if err != nil {
		panic(err)
	}

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "Catan",
		Width:  1800,
		Height: 800,
		// Fullscreen: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			settingsApi,
			app,
		},
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: false,
				HideTitle:                  false,
				FullSizeContent:            true,
				UseToolbar:                 false,
			},
			WebviewIsTransparent: false,
			About: &mac.AboutInfo{
				Title:   "Catan",
				Message: "Catan",
				Icon:    iconMac,
			},
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
