import AppDataSource from "./ormconfig";

class DatabaseManager {
    public dataSource = AppDataSource;
    public connect() {
        (async () => {
            try {
                await this.dataSource.initialize();
                console.log("Data Source has been initialized!");

                await this.dataSource.runMigrations();
                console.log("Migrations have been run successfully.");
            } catch (error) {
              console.error("Error while connecting to the database", error);
            }
        })();
    }
}

export default new DatabaseManager();
