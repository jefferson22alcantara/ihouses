variable "hcloud_token" {
  description = "Hetzner Cloud API token"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "Public SSH key granted access to the server"
  type        = string
}

variable "server_name" {
  description = "Name of the Hetzner Cloud server"
  type        = string
  default     = "ihouses-prod"
}

variable "server_type" {
  description = "Hetzner Cloud server type"
  type        = string
  default     = "cx23"
}

variable "location" {
  description = "Hetzner Cloud datacenter location"
  type        = string
  default     = "nbg1"
}
