using System.ComponentModel.DataAnnotations.Schema;

namespace ASP.NETCore.API.Models
{
    public class Notification
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? EmployeeName { get; set; }
        public string ?TranType { get; set; }
    }
}
