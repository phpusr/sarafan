package letscode.sarafan.domain

import com.fasterxml.jackson.annotation.*
import org.springframework.data.jpa.repository.JpaRepository
import javax.persistence.*

@Entity
class UserSubscription(
        @MapsId("channelId")
        @ManyToOne
        @JsonView(Views.IdName::class)
        @JsonIdentityReference
        @JsonIdentityInfo(
                property = "id",
                generator = ObjectIdGenerators.PropertyGenerator::class
        )
        val channel: User,

        @MapsId("subscriberId")
        @ManyToOne
        @JsonView(Views.IdName::class)
        @JsonIdentityReference
        @JsonIdentityInfo(
                property = "id",
                generator = ObjectIdGenerators.PropertyGenerator::class
        )
        val subscriber: User,

        @JsonView(Views.IdName::class)
        val active: Boolean = false
) {
        @EmbeddedId
        @JsonIgnore
        val id: UserSubscriptionId = UserSubscriptionId(channel.id, subscriber.id)

        override fun equals(other: Any?): Boolean {
                if (this === other) return true
                if (javaClass != other?.javaClass) return false

                other as UserSubscription

                if (id != other.id) return false

                return true
        }

        override fun hashCode(): Int {
                return id.hashCode()
        }
}

interface UserSubscriptionRepo : JpaRepository<UserSubscription, UserSubscriptionId> {
        fun findBySubscriber(user: User): List<UserSubscription>
}