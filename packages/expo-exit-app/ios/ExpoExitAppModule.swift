import ExpoModulesCore

public class ExpoExitAppModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoExitApp")

    Function("exit") {
      exit(0)
    }
  }
}
