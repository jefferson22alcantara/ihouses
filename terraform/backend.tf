terraform {
  cloud {
    organization = "ihouses"

    workspaces {
      name = "ihouses-production"
    }
  }
}
