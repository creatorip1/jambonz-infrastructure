# Create SBC SIP instances
data "aws_ami" "jambonz-sbc-sip" {
  most_recent      = true
  name_regex       = "^jambonz-sbc-sip"
  owners           = ["376029039784"]
}
resource "aws_eip" "jambonz-sbc-sip" {
  count          = length(var.jambonz_sbc_sip_private_ips)

  instance = aws_instance.jambonz-sbc-sip-server[count.index].id
  vpc      = true
}
resource "aws_instance" "jambonz-sbc-sip-server" {
  count          = length(var.jambonz_sbc_sip_private_ips)

  ami                    = data.aws_ami.jambonz-sbc-sip.id
  instance_type          = var.ec2_instance_type
  private_ip             = var.jambonz_sbc_sip_private_ips[count.index]
  subnet_id              = local.my_subnet_ids[count.index]
  vpc_security_group_ids = [aws_security_group.allow_jambonz_sbc_sip.id]
  user_data              = templatefile("${path.module}/sbc-sip-server.ecosystem.config.js.tmpl", {
    VPC_CIDR                = var.vpc_cidr_block
    JAMBONES_SBC_SIP_IPS    = join(",", var.jambonz_sbc_sip_private_ips)
    JAMBONES_RTPENGINE_IPS  = join(",", local.rtpengine_hostports)
    JAMBONES_MYSQL_HOST     = aws_rds_cluster.jambonz.endpoint
    JAMBONES_MYSQL_USER     = aws_rds_cluster.jambonz.master_username
    JAMBONES_MYSQL_PASSWORD = aws_rds_cluster.jambonz.master_password
    JAMBONES_REDIS_HOST     = aws_elasticache_cluster.jambonz.cache_nodes.0.address
    MS_TEAMS_FQDN           = var.ms_teams_fqdn
    JAMBONES_CLUSTER_ID     = var.cluster_id
    DATADOG_API_KEY         = var.datadog_api_key,
    DATADOG_SITE            = var.datadog_site,
    DATADOG_ENV_NAME        = var.datadog_env_name
  })
  key_name               = var.key_name
  monitoring             = true
  
  depends_on = [aws_internet_gateway.jambonz, aws_elasticache_cluster.jambonz, aws_rds_cluster.jambonz]

  tags = {
    Name = "${var.prefix}-sbc-sip-server"  
  }
}

# Create SBC RTP instances
data "aws_ami" "jambonz-sbc-rtp" {
  most_recent      = true
  name_regex       = "^jambonz-sbc-rtp"
  owners           = ["376029039784"]
}
resource "aws_eip" "jambonz-sbc-rtp" {
  count          = length(var.jambonz_sbc_rtp_private_ips)

  instance = aws_instance.jambonz-sbc-rtp-server[count.index].id
  vpc      = true
}
resource "aws_instance" "jambonz-sbc-rtp-server" {
  count          = length(var.jambonz_sbc_rtp_private_ips)

  ami                    = data.aws_ami.jambonz-sbc-rtp.id
  instance_type          = var.ec2_instance_type
  private_ip             = var.jambonz_sbc_rtp_private_ips[count.index]
  subnet_id              = local.my_subnet_ids[count.index]
  vpc_security_group_ids = [aws_security_group.allow_jambonz_sbc_rtp.id]
  key_name               = var.key_name
  monitoring             = true
  user_data              = templatefile("${path.module}/sbc-rtp-server.ecosystem.config.js.tmpl", {
    DATADOG_API_KEY         = var.datadog_api_key,
    DATADOG_SITE            = var.datadog_site,
    DATADOG_ENV_NAME        = var.datadog_env_name
  })

  depends_on = [aws_internet_gateway.jambonz]

  tags = {
    Name = "${var.prefix}-sbc-rtp-server"  
  }
}

# seed the database, from one of the feature servers
resource "null_resource" "seed" {

  # Bootstrap script can run on any instance of the cluster
  # So we just choose the first in this case
  connection {
    type      = "ssh"
    user      = "admin"
    private_key = file("${var.ssh_key_path}")
    host      = element(aws_eip.jambonz-sbc-sip.*.public_ip, 0)
  }

  provisioner "remote-exec" {
    inline = [
      "mysql -h ${aws_rds_cluster.jambonz.endpoint} -u admin -D jambones -pJambonzR0ck$ < /home/admin/apps/jambonz-api-server/db/jambones-sql.sql",
      "mysql -h ${aws_rds_cluster.jambonz.endpoint} -u admin -D jambones -pJambonzR0ck$ < /home/admin/apps/jambonz-api-server/db/create-admin-token.sql",
      "mysql -h ${aws_rds_cluster.jambonz.endpoint} -u admin -D jambones -pJambonzR0ck$ < /home/admin/apps/jambonz-api-server/db/create-default-account.sql"
      "JAMBONES_MYSQL_HOST=${aws_rds_cluster.jambonz.endpoint} JAMBONES_MYSQL_USER=admin JAMBONES_MYSQL_PASSWORD=JambonzR0ck$ JAMBONES_MYSQL_DATABASE=jambones /home/admin/apps/jambonz-api-server/db/reset_admin_password.js"
   ]
  }

  depends_on = [aws_rds_cluster.jambonz, aws_instance.jambonz-sbc-sip-server]
}
