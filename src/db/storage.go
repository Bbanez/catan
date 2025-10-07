package db

import (
	"os"
	"os/user"
	"strings"
)

type DBStorage struct {
	dbPath string
}

const baseDir = "Catan"

func NewDBStorage(collectionName string) DBStorage {
	usr, err := user.Current()
	if err != nil {
		panic(err)
	}
	if !dirExists(usr.HomeDir + "/" + baseDir) {
		os.Mkdir(usr.HomeDir+"/"+baseDir, 0755)
	}
	if !dirExists(usr.HomeDir + "/" + baseDir + "/db") {
		os.Mkdir(usr.HomeDir+"/"+baseDir+"/db", 0755)
	}
	dbPath := usr.HomeDir + "/" + baseDir + "/db/" + collectionName
	if !dirExists(dbPath) {
		os.Mkdir(dbPath, 0755)
	}
	return DBStorage{
		dbPath: dbPath,
	}
}

func (storage *DBStorage) Write(entryId string, data []byte) error {
	err := os.WriteFile(storage.dbPath+"/"+entryId+".bin", data, 0644)
	if err != nil {
		return err
	}
	return nil
}

func (storage *DBStorage) Read(entryId string) ([]byte, error) {
	data, err := os.ReadFile(storage.dbPath + "/" + entryId + ".bin")
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (storage *DBStorage) ReadAll() [][]byte {
	files, err := listFiles(storage.dbPath)
	if err != nil {
		return nil
	}
	var result [][]byte = [][]byte{}
	for _, file := range files {
		if !strings.HasSuffix(file, ".bin") {
			continue
		}
		data, err := storage.Read(strings.Replace(file, ".bin", "", 1))
		if err != nil {
			return nil
		}
		result = append(result, data)
	}
	return result
}

func (storage *DBStorage) Remove(entryId string) {
	os.Remove(storage.dbPath + "/" + entryId + ".bin")
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
		if !entry.IsDir() {
			files = append(files, entry.Name())
		}
	}
	return files, nil
}
