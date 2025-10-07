package srv

import (
	"github.com/gofiber/fiber/v2"
)

var app *fiber.App

func Get() *fiber.App {
	return app
}

func IsRunning() bool {
	return app != nil
}

func Start() {
	app = fiber.New()
	go func() {
		err := app.Listen("0.0.0.0:41234")
		if err != nil {
			panic(err)
		}
	}()
}

func Stop() {
	err := app.Shutdown()
	if err != nil {
		panic(err)
	}
	app = nil
}
