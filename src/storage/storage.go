package storage

import (
	"os"
	"os/user"
	"strings"
)

type Storage struct {
	storagePath string
}

const baseDir = "Catan"

func New() *Storage {
	usr, err := user.Current()
	if err != nil {
		panic(err)
	}
	if !dirExists(usr.HomeDir + "/" + baseDir) {
		os.Mkdir(usr.HomeDir+"/"+baseDir, 0755)
	}
	if !dirExists(usr.HomeDir + "/" + baseDir + "/storage") {
		os.Mkdir(usr.HomeDir+"/"+baseDir+"/storage", 0755)
	}
	storagePath := usr.HomeDir + "/" + baseDir + "/storage"
	return &Storage{
		storagePath: storagePath,
	}
}

func (storage *Storage) mkdirIfNotExists(path string) {
	parts := strings.Split(path, "/")
	for i := 0; i < len(parts)-1; i++ {
		if parts[i] == "" {
			continue
		}
		path = strings.Join(parts[:i+1], "/")
		aPath := storage.storagePath + "/" + path
		if !dirExists(aPath) {
			os.Mkdir(aPath, 0755)
		}
	}
}

func (storage *Storage) Write(path string, data []byte) error {
	storage.mkdirIfNotExists(path)
	err := os.WriteFile(storage.storagePath+"/"+path, data, 0644)
	if err != nil {
		return err
	}
	return nil
}

func (storage *Storage) Read(path string) ([]byte, error) {
	data, err := os.ReadFile(storage.storagePath + "/" + path)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (storage *Storage) Remove(path string) {
	os.Remove(storage.storagePath + "/" + path)
}

func (storage *Storage) ListFiles() []string {
	files, err := listFiles(storage.storagePath)
	if err != nil {
		return nil
	}
	return files
}

func dirExists(path string) bool {
	info, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return info.IsDir()
}

func listFiles(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	var files []string = []string{}
	for _, entry := range entries {
		if entry.IsDir() {
			childFiles, err := listFiles(dir + "/" + entry.Name())
			if err != nil {
				return nil, err
			}
			files = append(files, childFiles...)
		} else {
			files = append(files, dir+"/"+entry.Name())
		}
	}
	return files, nil
}
